import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClassroomsRepository } from '../../../academic/classrooms/index.js';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto.js';
import { AnnouncementsRepository } from '../repositories/announcements.repository.js';

@Injectable()
export class UpdateAnnouncementUseCase {
  private readonly logger = new Logger(UpdateAnnouncementUseCase.name);

  constructor(
    private readonly repository: AnnouncementsRepository,
    private readonly ClassroomsRepository: ClassroomsRepository,
  ) {}

  async execute(id: string, dto: UpdateAnnouncementDto) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    if (dto.classroomIds?.length) {
      for (const classroomId of dto.classroomIds) {
        const classObj = await this.ClassroomsRepository.findById(classroomId);
        if (!classObj) {
          throw new NotFoundException(
            `Classroom with ID ${classroomId} not found`,
          );
        }
      }
    }

    const { classroomIds, date, ...rest } = dto;

    const updated = await this.repository.update(
      id,
      { ...rest, ...(date && { date: new Date(date) }) },
      classroomIds,
    );

    this.logger.log(`Announcement updated: ${id}`);
    return updated;
  }
}
