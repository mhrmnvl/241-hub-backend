import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationalHistoriesRepository } from '../repositories/educational-histories.repository.js';
import { UpdateEducationalHistoryDto } from '../dto/update-educational-history.dto.js';

@Injectable()
export class UpdateEducationalHistoryUseCase {
  constructor(private readonly repo: EducationalHistoriesRepository) {}

  async execute(id: string, dto: UpdateEducationalHistoryDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Educational history not found');
    return this.repo.update(id, dto);
  }
}
