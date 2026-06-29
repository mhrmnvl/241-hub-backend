import { Injectable } from '@nestjs/common';
import { EducationalHistoriesRepository } from '../repositories/educational-histories.repository.js';
import { CreateEducationalHistoryDto } from '../dto/create-educational-history.dto.js';

@Injectable()
export class CreateEducationalHistoryUseCase {
  constructor(private readonly repo: EducationalHistoriesRepository) {}

  async execute(dto: CreateEducationalHistoryDto) {
    return this.repo.create(dto);
  }
}
