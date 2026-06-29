import { Module } from '@nestjs/common';
import { SubjectsController } from './controllers/subjects.controller.js';
import { SubjectsRepository } from './repositories/subjects.repository.js';
import { CreateSubjectUseCase } from './use-cases/create-subject.use-case.js';
import { DeleteSubjectUseCase } from './use-cases/delete-subject.use-case.js';
import { GetSubjectByIdUseCase } from './use-cases/get-subject-by-id.use-case.js';
import { GetSubjectsUseCase } from './use-cases/get-subjects.use-case.js';
import { UpdateSubjectUseCase } from './use-cases/update-subject.use-case.js';

@Module({
  controllers: [SubjectsController],
  providers: [
    SubjectsRepository,
    GetSubjectsUseCase,
    GetSubjectByIdUseCase,
    CreateSubjectUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase,
  ],
  exports: [SubjectsRepository],
})
export class SubjectsModule {}
