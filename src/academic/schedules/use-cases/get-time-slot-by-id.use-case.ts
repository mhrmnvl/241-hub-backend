import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeSlotsRepository } from '../repositories/time-slots.repository.js';

@Injectable()
export class GetTimeSlotByIdUseCase {
  constructor(private readonly repo: TimeSlotsRepository) {}

  async execute(id: string, schoolUnitId: string) {
    const ts = await this.repo.findById(id, schoolUnitId);
    if (!ts) throw new NotFoundException(`TimeSlot with ID ${id} not found`);
    return ts;
  }
}
