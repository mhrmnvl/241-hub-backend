import { Module } from '@nestjs/common';
import { EmploymentTypesController } from './controllers/employment-types.controller.js';
import { EmploymentTypesRepository } from './repositories/employment-types.repository.js';
import { CreateEmploymentTypeUseCase } from './use-cases/create-employment-type.use-case.js';
import { GetEmploymentTypesUseCase } from './use-cases/get-employment-types.use-case.js';
import { GetEmploymentTypeByIdUseCase } from './use-cases/get-employment-type-by-id.use-case.js';
import { UpdateEmploymentTypeUseCase } from './use-cases/update-employment-type.use-case.js';
import { DeleteEmploymentTypeUseCase } from './use-cases/delete-employment-type.use-case.js';

@Module({
  controllers: [EmploymentTypesController],
  providers: [
    EmploymentTypesRepository,
    CreateEmploymentTypeUseCase,
    GetEmploymentTypesUseCase,
    GetEmploymentTypeByIdUseCase,
    UpdateEmploymentTypeUseCase,
    DeleteEmploymentTypeUseCase,
  ],
  exports: [EmploymentTypesRepository],
})
export class EmploymentTypesModule {}
