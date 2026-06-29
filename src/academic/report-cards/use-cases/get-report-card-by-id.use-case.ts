import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportCardsRepository } from '../repositories/report-cards.repository.js';

@Injectable()
export class GetReportCardByIdUseCase {
  constructor(private readonly repo: ReportCardsRepository) {}

  async execute(id: string) {
    const reportCard = await this.repo.findById(id);
    if (!reportCard)
      throw new NotFoundException(`ReportCard with ID ${id} not found`);
    return reportCard;
  }
}
