import { Injectable } from '@nestjs/common';
import { Day, Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { ScheduleQueryDto } from '../dto/schedule.dto.js';

const INCLUDE = {
  teachingAssignment: {
    include: {
      teacher: { include: { user: { select: { profile: true } } } },
      classroom: true,
      subject: true,
    },
  },
  timeSlot: true,
} satisfies Prisma.ScheduleInclude;

@Injectable()
export class SchedulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ScheduleQueryDto) {
    const {
      page = 1,
      limit = 10,
      teachingAssignmentId,
      day,
      timeSlotId,
    } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.ScheduleWhereInput = {
      deletedAt: null,
      ...(teachingAssignmentId && { teachingAssignmentId }),
      ...(day && { day }),
      ...(timeSlotId && { timeSlotId }),
    };
    const [data, total] = await Promise.all([
      this.prisma.schedule.findMany({
        where,
        include: INCLUDE,
        skip,
        take: limit,
        orderBy: [{ day: 'asc' }, { timeSlot: { order: 'asc' } }],
      }),
      this.prisma.schedule.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.schedule.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE,
    });
  }

  async findDuplicate(
    teachingAssignmentId: string,
    day: Day,
    timeSlotId: string,
    excludeId?: string,
  ) {
    return this.prisma.schedule.findFirst({
      where: {
        teachingAssignmentId,
        day,
        timeSlotId,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(data: {
    teachingAssignmentId: string;
    timeSlotId: string;
    day: Day;
    room?: string;
  }) {
    return this.prisma.schedule.create({ data, include: INCLUDE });
  }

  async update(id: string, data: Prisma.ScheduleUpdateInput) {
    return this.prisma.schedule.update({
      where: { id },
      data,
      include: INCLUDE,
    });
  }

  async findSoftDeleted(
    teachingAssignmentId: string,
    day: Day,
    timeSlotId: string,
  ) {
    return this.prisma.schedule.findFirst({
      where: {
        teachingAssignmentId,
        day,
        timeSlotId,
        deletedAt: { not: null },
      },
    });
  }

  async restore(id: string, data: { room?: string }) {
    return this.prisma.schedule.update({
      where: { id },
      data: { ...data, deletedAt: null },
      include: INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.schedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByClassroom(classroomId: string) {
    return this.prisma.schedule.findMany({
      where: {
        deletedAt: null,
        teachingAssignment: { classroomId, deletedAt: null },
      },
      include: INCLUDE,
      orderBy: [{ day: 'asc' }, { timeSlot: { order: 'asc' } }],
    });
  }

  async softDeleteByClassroomAndDay(classroomId: string, day: Day) {
    return this.prisma.schedule.updateMany({
      where: {
        deletedAt: null,
        day,
        teachingAssignment: { classroomId, deletedAt: null },
      },
      data: { deletedAt: new Date() },
    });
  }
}
