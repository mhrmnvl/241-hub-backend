import { Module } from '@nestjs/common';
import { EnrollmentsModule } from '../enrollments/enrollments.module.js';
import { AssessmentsModule } from '../assessments/assessments.module.js';
import { ReportCardsController } from './controllers/report-cards.controller.js';
import { ReportCardsRepository } from './repositories/report-cards.repository.js';
import { DeleteReportCardUseCase } from './use-cases/delete-report-card.use-case.js';
import { GenerateReportCardUseCase } from './use-cases/generate-report-card.use-case.js';
import { GetReportCardByIdUseCase } from './use-cases/get-report-card-by-id.use-case.js';
import { GetReportCardsUseCase } from './use-cases/get-report-cards.use-case.js';
import { PublishReportCardUseCase } from './use-cases/publish-report-card.use-case.js';
import { UpdateReportCardUseCase } from './use-cases/update-report-card.use-case.js';

@Module({
  imports: [AssessmentsModule, EnrollmentsModule],
  controllers: [ReportCardsController],
  providers: [
    ReportCardsRepository,

    GetReportCardsUseCase,
    GetReportCardByIdUseCase,
    GenerateReportCardUseCase,
    UpdateReportCardUseCase,
    PublishReportCardUseCase,
    DeleteReportCardUseCase,
  ],
  exports: [ReportCardsRepository],
})
export class ReportCardsModule {}
