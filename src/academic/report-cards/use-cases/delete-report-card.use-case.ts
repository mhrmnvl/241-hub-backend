import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReportCardsRepository } from '../repositories/report-cards.repository.js';

@Injectable()
export class DeleteReportCardUseCase {
  private readonly logger = new Logger(DeleteReportCardUseCase.name);

  constructor(private readonly repo: ReportCardsRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing)
      throw new NotFoundException(`ReportCard with ID ${id} not found`);

    await this.repo.softDelete(id);
    this.logger.log(`ReportCard soft-deleted: ${id}`);
  }
}
