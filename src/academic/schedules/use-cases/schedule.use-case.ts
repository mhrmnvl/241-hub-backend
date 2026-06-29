import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import {
  BatchUpsertScheduleDto,
  CreateScheduleDto,
  ScheduleQueryDto,
  UpdateScheduleDto,
} from '../dto/schedule.dto.js';
import { SchedulesRepository } from '../repositories/schedules.repository.js';

@Injectable()
export class GetSchedulesUseCase {
  constructor(private readonly repo: SchedulesRepository) {}
  async execute(query: ScheduleQueryDto) {
    return this.repo.findAll(query);
  }
}

@Injectable()
export class GetScheduleByIdUseCase {
  constructor(private readonly repo: SchedulesRepository) {}
  async execute(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`Schedule ${id} not found`);
    return r;
  }
}

@Injectable()
export class GetSchedulesByClassroomUseCase {
  constructor(private readonly repo: SchedulesRepository) {}
  async execute(classroomId: string) {
    return this.repo.findByClassroom(classroomId);
  }
}

@Injectable()
export class CreateScheduleUseCase {
  constructor(private readonly repo: SchedulesRepository) {}
  async execute(dto: CreateScheduleDto) {
    const dup = await this.repo.findDuplicate(
      dto.teachingAssignmentId,
      dto.day,
      dto.timeSlotId,
    );
    if (dup)
      throw new ConflictException(
        'Schedule already exists for this assignment, day and timeslot',
      );

    const softDeleted = await this.repo.findSoftDeleted(
      dto.teachingAssignmentId,
      dto.day,
      dto.timeSlotId,
    );
    if (softDeleted) {
      return this.repo.restore(softDeleted.id, {
        room: dto.room ?? undefined,
      });
    }

    return this.repo.create(dto);
  }
}

@Injectable()
export class UpdateScheduleUseCase {
  constructor(private readonly repo: SchedulesRepository) {}
  async execute(id: string, dto: UpdateScheduleDto) {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException(`Schedule ${id} not found`);
    const taId = dto.teachingAssignmentId ?? current.teachingAssignmentId;
    const day = dto.day ?? current.day;
    const tsId = dto.timeSlotId ?? current.timeSlotId;
    if (
      taId !== current.teachingAssignmentId ||
      day !== current.day ||
      tsId !== current.timeSlotId
    ) {
      const dup = await this.repo.findDuplicate(taId, day, tsId, id);
      if (dup) throw new ConflictException('Schedule already exists');
    }
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class DeleteScheduleUseCase {
  constructor(private readonly repo: SchedulesRepository) {}
  async execute(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`Schedule ${id} not found`);
    return this.repo.softDelete(id);
  }
}

@Injectable()
export class BatchUpsertScheduleUseCase {
  constructor(
    private readonly repo: SchedulesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(classroomId: string, dto: BatchUpsertScheduleDto) {
    // Cari semester aktif
    const semester = await this.prisma.semester.findFirst({
      where: { isActive: true, deletedAt: null },
    });
    if (!semester) {
      throw new BadRequestException('Tidak ada semester aktif');
    }

    // Soft-delete semua schedule yang ada untuk kelas+hari ini
    await this.repo.softDeleteByClassroomAndDay(classroomId, dto.day);

    // Jika lessons kosong (hapus semua), cukup return
    if (dto.lessons.length === 0) {
      return { created: 0, day: dto.day };
    }

    let created = 0;
    for (const row of dto.lessons) {
      // Resolve subjectId → teachingAssignment (find or create)
      let ta = await this.prisma.teachingAssignment.findFirst({
        where: {
          classroomId,
          subjectId: row.subjectId,
          semesterId: semester.id,
          deletedAt: null,
        },
      });

      if (!ta) {
        // Cari guru pertama yang mengajar mapel ini (dari TA yang sudah ada)
        const existingTa = await this.prisma.teachingAssignment.findFirst({
          where: { subjectId: row.subjectId, deletedAt: null },
          select: { teacherId: true },
        });

        if (!existingTa) {
          throw new BadRequestException(
            `Tidak ada guru yang mengajar mapel dengan ID ${row.subjectId}`,
          );
        }

        ta = await this.prisma.teachingAssignment.create({
          data: {
            classroomId,
            subjectId: row.subjectId,
            teacherId: existingTa.teacherId,
            semesterId: semester.id,
          },
        });
      }

      // Cek apakah ada soft-deleted schedule yang bisa di-restore
      const softDeleted = await this.repo.findSoftDeleted(
        ta.id,
        dto.day,
        row.timeSlotId,
      );
      if (softDeleted) {
        await this.repo.restore(softDeleted.id, {});
      } else {
        await this.repo.create({
          teachingAssignmentId: ta.id,
          timeSlotId: row.timeSlotId,
          day: dto.day,
        });
      }
      created++;
    }

    return { created, day: dto.day };
  }
}
