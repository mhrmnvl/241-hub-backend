import { Injectable } from '@nestjs/common';
import { ReportCardQueryDto } from '../dto/report-card-query.dto.js';
import { ReportCardsRepository } from '../repositories/report-cards.repository.js';

@Injectable()
export class GetReportCardsUseCase {
  constructor(private readonly repo: ReportCardsRepository) {}

  async execute(query: ReportCardQueryDto) {
    return this.repo.findAll(query);
  }
}
