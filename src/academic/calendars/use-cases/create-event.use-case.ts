import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClassroomsRepository } from '../../classrooms/index.js';
import { CreateEventDto } from '../dto/create-event.dto.js';
import { EventsRepository } from '../repositories/events.repository.js';

@Injectable()
export class CreateEventUseCase {
  private readonly logger = new Logger(CreateEventUseCase.name);

  constructor(
    private readonly repository: EventsRepository,
    private readonly ClassroomsRepository: ClassroomsRepository,
  ) {}

  async execute(dto: CreateEventDto, schoolUnitId: string) {
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

    const event = await this.repository.create(dto, schoolUnitId);
    this.logger.log(
      `Event created: "${dto.title}" - targets: ${dto.classroomIds?.length ? dto.classroomIds.join(', ') : 'school-wide'}`,
    );
    return event;
  }
}
