import { Module } from '@nestjs/common';
import { EducationsController } from './controllers/educations.controller.js';
import { EducationsRepository } from './repositories/educations.repository.js';
import { CreateEducationUseCase } from './use-cases/create-education.use-case.js';
import { DeleteEducationUseCase } from './use-cases/delete-education.use-case.js';
import { GetEducationByIdUseCase } from './use-cases/get-education-by-id.use-case.js';
import { GetEducationsUseCase } from './use-cases/get-educations.use-case.js';
import { UpdateEducationUseCase } from './use-cases/update-education.use-case.js';

@Module({
  controllers: [EducationsController],
  providers: [
    EducationsRepository,
    GetEducationsUseCase,
    GetEducationByIdUseCase,
    CreateEducationUseCase,
    UpdateEducationUseCase,
    DeleteEducationUseCase,
  ],
  exports: [EducationsRepository],
})
export class EducationsModule {}
