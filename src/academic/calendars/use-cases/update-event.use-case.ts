import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClassroomsRepository } from '../../classrooms/index.js';
import { UpdateEventDto } from '../dto/update-event.dto.js';
import { EventsRepository } from '../repositories/events.repository.js';

@Injectable()
export class UpdateEventUseCase {
  private readonly logger = new Logger(UpdateEventUseCase.name);

  constructor(
    private readonly repository: EventsRepository,
    private readonly ClassroomsRepository: ClassroomsRepository,
  ) {}

  async execute(id: string, dto: UpdateEventDto, schoolUnitId: string) {
    const current = await this.repository.findById(id, schoolUnitId);
    if (!current) throw new NotFoundException(`Event with ID ${id} not found`);

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

    const updated = await this.repository.update(id, dto, schoolUnitId);
    this.logger.log(`Event updated: ${id}`);
    return updated;
  }
}
