import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTimeSlotDto } from '../dto/update-time-slot.dto.js';
import { TimeSlotsRepository } from '../repositories/time-slots.repository.js';

@Injectable()
export class UpdateTimeSlotUseCase {
  private readonly logger = new Logger(UpdateTimeSlotUseCase.name);

  constructor(private readonly repo: TimeSlotsRepository) {}

  async execute(id: string, dto: UpdateTimeSlotDto, schoolUnitId: string) {
    const existing = await this.repo.findById(id, schoolUnitId);
    if (!existing)
      throw new NotFoundException(`TimeSlot with ID ${id} not found`);

    if (dto.order !== undefined) {
      const conflict = await this.repo.findByOrder(dto.order, schoolUnitId, id);
      if (conflict) {
        throw new ConflictException(
          `Time slot with order ${dto.order} already exists`,
        );
      }
    }

    const updated = await this.repo.update(id, dto, schoolUnitId);
    this.logger.log(`TimeSlot updated: ${id}`);
    return updated;
  }
}
