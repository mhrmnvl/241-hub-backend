import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationalHistoriesRepository } from '../repositories/educational-histories.repository.js';

@Injectable()
export class GetEducationalHistoryByIdUseCase {
  constructor(private readonly repo: EducationalHistoriesRepository) {}

  async execute(id: string) {
    const record = await this.repo.findById(id);
    if (!record) throw new NotFoundException('Educational history not found');
    return record;
  }
}
