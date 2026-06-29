import { Module } from '@nestjs/common';
import { AcademicYearsModule } from '../academic-years/academic-years.module.js';
import { SemestersController } from './controllers/semesters.controller.js';
import { PromotionRepository } from './repositories/promotion.repository.js';
import { RolloverRepository } from './repositories/rollover.repository.js';
import { SemestersRepository } from './repositories/semesters.repository.js';
import { ActivateSemesterUseCase } from './use-cases/activate-semester.use-case.js';
import { CreateSemesterUseCase } from './use-cases/create-semester.use-case.js';
import { DeactivateSemesterUseCase } from './use-cases/deactivate-semester.use-case.js';
import { DeleteSemesterUseCase } from './use-cases/delete-semester.use-case.js';
import { GeneratePromotionRecommendationUseCase } from './use-cases/generate-promotion-recommendation.use-case.js';
import { GetSemesterByIdUseCase } from './use-cases/get-semester-by-id.use-case.js';
import { GetSemestersUseCase } from './use-cases/get-semesters.use-case.js';
import { PreviewPromotionUseCase } from './use-cases/preview-promotion.use-case.js';
import { PromoteStudentsUseCase } from './use-cases/promote-students.use-case.js';
import { RolloverSemesterUseCase } from './use-cases/rollover-semester.use-case.js';
import { UpdateSemesterUseCase } from './use-cases/update-semester.use-case.js';

@Module({
  imports: [AcademicYearsModule],
  controllers: [SemestersController],
  providers: [
    SemestersRepository,
    RolloverRepository,
    PromotionRepository,
    GetSemestersUseCase,
    GetSemesterByIdUseCase,
    CreateSemesterUseCase,
    UpdateSemesterUseCase,
    DeleteSemesterUseCase,
    RolloverSemesterUseCase,
    PromoteStudentsUseCase,
    PreviewPromotionUseCase,
    GeneratePromotionRecommendationUseCase,
    ActivateSemesterUseCase,
    DeactivateSemesterUseCase,
  ],
  exports: [SemestersRepository, RolloverRepository],
})
export class SemestersModule {}
