import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationalHistoriesRepository } from '../repositories/educational-histories.repository.js';

@Injectable()
export class DeleteEducationalHistoryUseCase {
  constructor(private readonly repo: EducationalHistoriesRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Educational history not found');
    await this.repo.softDelete(id);
    return { message: 'Educational history deleted successfully' };
  }
}
