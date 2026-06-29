import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository.js';

@Injectable()
export class DeleteEventUseCase {
  private readonly logger = new Logger(DeleteEventUseCase.name);

  constructor(private readonly repository: EventsRepository) {}

  async execute(id: string, schoolUnitId: string): Promise<void> {
    const event = await this.repository.findById(id, schoolUnitId);
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

    await this.repository.softDelete(id, schoolUnitId);
    this.logger.log(`Event soft-deleted: ${id}`);
  }
}
