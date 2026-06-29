import { Module } from '@nestjs/common';
import { TeachersController } from './controllers/teachers.controller.js';
import { TeacherAddressesController } from './controllers/teacher-addresses.controller.js';
import { TeacherPositionsController } from './controllers/teacher-positions.controller.js';
import { TeachersRepository } from './repositories/teachers.repository.js';
import { TeacherAddressesRepository } from './repositories/teacher-addresses.repository.js';
import { TeacherPositionsRepository } from './repositories/teacher-positions.repository.js';

// UseCases
import { CreateTeacherUseCase } from './use-cases/create-teacher.use-case.js';
import { DeleteTeacherUseCase } from './use-cases/delete-teacher.use-case.js';
import { GetTeacherByIdUseCase } from './use-cases/get-teacher-by-id.use-case.js';
import { GetTeachersUseCase } from './use-cases/get-teachers.use-case.js';
import { UpdateTeacherUseCase } from './use-cases/update-teacher.use-case.js';
import { UpdateTeacherProfileUseCase } from './use-cases/update-teacher-profile.use-case.js';
import { ToggleTeacherActiveUseCase } from './use-cases/toggle-teacher-active.use-case.js';
import { BulkImportTeachersUseCase } from './use-cases/bulk-import-teachers.use-case.js';
import { ExportTeachersUseCase } from './use-cases/export-teachers.use-case.js';
import { TeacherAddressUseCase } from './use-cases/teacher-address.use-case.js';
import { TeacherPositionUseCase } from './use-cases/teacher-position.use-case.js';

@Module({
  controllers: [
    TeachersController,
    TeacherAddressesController,
    TeacherPositionsController,
  ],
  providers: [
    TeachersRepository,
    TeacherAddressesRepository,
    TeacherPositionsRepository,
    CreateTeacherUseCase,
    DeleteTeacherUseCase,
    GetTeacherByIdUseCase,
    GetTeachersUseCase,
    UpdateTeacherUseCase,
    UpdateTeacherProfileUseCase,
    ToggleTeacherActiveUseCase,
    BulkImportTeachersUseCase,
    ExportTeachersUseCase,
    TeacherAddressUseCase,
    TeacherPositionUseCase,
  ],
  exports: [
    TeachersRepository,
    TeacherAddressesRepository,
    TeacherPositionsRepository,
  ],
})
export class TeachersModule {}
