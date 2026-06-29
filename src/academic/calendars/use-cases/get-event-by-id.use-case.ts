import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository.js';

@Injectable()
export class GetEventByIdUseCase {
  constructor(private readonly repository: EventsRepository) {}

  async execute(id: string, schoolUnitId: string) {
    const event = await this.repository.findById(id, schoolUnitId);
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }
}
