import { Injectable } from '@nestjs/common';
import { TimeSlotsRepository } from '../repositories/time-slots.repository.js';

@Injectable()
export class GetTimeSlotsUseCase {
  constructor(private readonly repo: TimeSlotsRepository) {}

  async execute(schoolUnitId: string) {
    return this.repo.findAll(schoolUnitId);
  }
}
