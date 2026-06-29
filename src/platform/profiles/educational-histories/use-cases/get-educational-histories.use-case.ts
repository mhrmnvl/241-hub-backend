import { Injectable } from '@nestjs/common';
import { EducationalHistoriesRepository } from '../repositories/educational-histories.repository.js';
import { EducationalHistoryQueryDto } from '../dto/educational-history-query.dto.js';

@Injectable()
export class GetEducationalHistoriesUseCase {
  constructor(private readonly repo: EducationalHistoriesRepository) {}

  async execute(query: EducationalHistoryQueryDto) {
    return this.repo.findAll(query);
  }
}
