import { Module } from '@nestjs/common';
import { ClassroomLevelsController } from './controllers/grades.controller.js';
import { ClassroomLevelsRepository } from './repositories/grades.repository.js';
import { CreateClassroomLevelUseCase } from './use-cases/create-grade.use-case.js';
import { DeleteClassroomLevelUseCase } from './use-cases/delete-grade.use-case.js';
import { GetClassroomLevelByIdUseCase } from './use-cases/get-grade-by-id.use-case.js';
import { GetClassroomLevelsUseCase } from './use-cases/get-grades.use-case.js';
import { UpdateClassroomLevelUseCase } from './use-cases/update-grade.use-case.js';

@Module({
  controllers: [ClassroomLevelsController],
  providers: [
    ClassroomLevelsRepository,
    GetClassroomLevelsUseCase,
    GetClassroomLevelByIdUseCase,
    CreateClassroomLevelUseCase,
    UpdateClassroomLevelUseCase,
    DeleteClassroomLevelUseCase,
  ],
  exports: [ClassroomLevelsRepository],
})
export class GradesModule {}
