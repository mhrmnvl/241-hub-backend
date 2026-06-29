import { Module } from '@nestjs/common';
import { GraduationsController } from './controllers/graduations.controller.js';
import { GraduationsRepository } from './repositories/graduations.repository.js';
import { CreateStudentGraduationUseCase } from './use-cases/create-student-graduation.use-case.js';
import { DeleteStudentGraduationUseCase } from './use-cases/delete-student-graduation.use-case.js';
import { GetStudentGraduationByIdUseCase } from './use-cases/get-student-graduation-by-id.use-case.js';
import { GetStudentGraduationsUseCase } from './use-cases/get-student-graduations.use-case.js';
import { UpdateStudentGraduationUseCase } from './use-cases/update-student-graduation.use-case.js';

@Module({
  controllers: [GraduationsController],
  providers: [
    GraduationsRepository,
    GetStudentGraduationsUseCase,
    GetStudentGraduationByIdUseCase,
    CreateStudentGraduationUseCase,
    UpdateStudentGraduationUseCase,
    DeleteStudentGraduationUseCase,
  ],
  exports: [GraduationsRepository],
})
export class GraduationsModule {}
