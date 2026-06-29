import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReportCardsRepository } from '../repositories/report-cards.repository.js';

@Injectable()
export class PublishReportCardUseCase {
  private readonly logger = new Logger(PublishReportCardUseCase.name);

  constructor(private readonly repo: ReportCardsRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing)
      throw new NotFoundException(`ReportCard with ID ${id} not found`);

    const updated = await this.repo.update(id, {
      isPublished: !existing.isPublished,
    });

    this.logger.log(
      `ReportCard ${id} ${updated.isPublished ? 'published' : 'unpublished'}`,
    );
    return updated;
  }
}
