import { Module } from '@nestjs/common';
import { AcademicYearsModule } from '../academic-years/academic-years.module.js';
import { CurriculaController } from './controllers/curricula.controller.js';
import { CurriculumSubjectsController } from './controllers/curriculum-subjects.controller.js';
import { CurriculaRepository } from './repositories/curricula.repository.js';
import { CurriculumSubjectsRepository } from './repositories/curriculum-subjects.repository.js';

import { CreateCurriculaUseCase } from './use-cases/create-curricula.use-case.js';
import { DeleteCurriculaUseCase } from './use-cases/delete-curricula.use-case.js';
import { GetCurriculaByIdUseCase } from './use-cases/get-curricula-by-id.use-case.js';
import { GetCurriculaUseCase } from './use-cases/get-curricula.use-case.js';
import { UpdateCurriculaUseCase } from './use-cases/update-curricula.use-case.js';

import { CreateCurriculumSubjectUseCase } from './use-cases/create-curriculum-subject.use-case.js';
import { DeleteCurriculumSubjectUseCase } from './use-cases/delete-curriculum-subject.use-case.js';
import { GetCurriculumSubjectByIdUseCase } from './use-cases/get-curriculum-subject-by-id.use-case.js';
import { GetCurriculumSubjectsUseCase } from './use-cases/get-curriculum-subjects.use-case.js';
import { UpdateCurriculumSubjectUseCase } from './use-cases/update-curriculum-subject.use-case.js';

@Module({
  imports: [AcademicYearsModule],
  controllers: [CurriculaController, CurriculumSubjectsController],
  providers: [
    CurriculaRepository,
    CurriculumSubjectsRepository,

    GetCurriculaUseCase,
    GetCurriculaByIdUseCase,
    CreateCurriculaUseCase,
    UpdateCurriculaUseCase,
    DeleteCurriculaUseCase,

    GetCurriculumSubjectsUseCase,
    GetCurriculumSubjectByIdUseCase,
    CreateCurriculumSubjectUseCase,
    UpdateCurriculumSubjectUseCase,
    DeleteCurriculumSubjectUseCase,
  ],
  exports: [CurriculaRepository, CurriculumSubjectsRepository],
})
export class CurriculaModule {}
