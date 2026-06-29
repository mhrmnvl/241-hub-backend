import { Module } from '@nestjs/common';
import { TeachingAssignmentsModule } from '../teaching-assignments/teaching-assignments.module.js';
import { SemestersModule } from '../semesters/semesters.module.js';
import { EnrollmentsModule } from '../enrollments/enrollments.module.js';
import { AssessmentItemsController } from './controllers/assessment-items.controller.js';
import { StudentScoresController } from './controllers/student-scores.controller.js';
import { AssessmentItemsRepository } from './repositories/assessment-items.repository.js';
import { StudentScoresRepository } from './repositories/student-scores.repository.js';

import {
  CreateAssessmentItemUseCase,
  DeleteAssessmentItemUseCase,
  GetAssessmentItemByIdUseCase,
  GetAssessmentItemsUseCase,
  UpdateAssessmentItemUseCase,
} from './use-cases/assessment-item.use-case.js';

import {
  CreateStudentScoreUseCase,
  DeleteStudentScoreUseCase,
  GetStudentScoreByIdUseCase,
  GetStudentScoresUseCase,
  UpdateStudentScoreUseCase,
} from './use-cases/student-score.use-case.js';

@Module({
  imports: [TeachingAssignmentsModule, SemestersModule, EnrollmentsModule],
  controllers: [AssessmentItemsController, StudentScoresController],
  providers: [
    AssessmentItemsRepository,
    StudentScoresRepository,

    GetAssessmentItemsUseCase,
    GetAssessmentItemByIdUseCase,
    CreateAssessmentItemUseCase,
    UpdateAssessmentItemUseCase,
    DeleteAssessmentItemUseCase,

    GetStudentScoresUseCase,
    GetStudentScoreByIdUseCase,
    CreateStudentScoreUseCase,
    UpdateStudentScoreUseCase,
    DeleteStudentScoreUseCase,
  ],
  exports: [AssessmentItemsRepository, StudentScoresRepository],
})
export class AssessmentsModule {}
