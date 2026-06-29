import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TimeSlotsRepository } from '../repositories/time-slots.repository.js';

@Injectable()
export class DeleteTimeSlotUseCase {
  private readonly logger = new Logger(DeleteTimeSlotUseCase.name);

  constructor(private readonly repo: TimeSlotsRepository) {}

  async execute(id: string, schoolUnitId: string): Promise<void> {
    const [ts, inUse] = await Promise.all([
      this.repo.findById(id, schoolUnitId),
      this.repo.countSchedulesUsing(id, schoolUnitId),
    ]);

    if (!ts) throw new NotFoundException(`TimeSlot with ID ${id} not found`);

    if (inUse > 0)
      throw new ConflictException(
        `TimeSlot is still used by ${inUse} active lesson(s) and cannot be deleted`,
      );

    await this.repo.remove(id, schoolUnitId);
    this.logger.log(`TimeSlot deleted: ${id}`);
  }
}
