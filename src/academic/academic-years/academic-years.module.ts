import { Module } from '@nestjs/common';
import { AcademicYearsController } from './controllers/academic-years.controller.js';
import { AcademicYearsRepository } from './repositories/academic-years.repository.js';
import { ActivateAcademicYearUseCase } from './use-cases/activate-academic-year.use-case.js';
import { CreateAcademicYearUseCase } from './use-cases/create-academic-year.use-case.js';
import { DeactivateAcademicYearUseCase } from './use-cases/deactivate-academic-year.use-case.js';
import { DeleteAcademicYearUseCase } from './use-cases/delete-academic-year.use-case.js';
import { GetAcademicYearByIdUseCase } from './use-cases/get-academic-year-by-id.use-case.js';
import { GetAcademicYearsUseCase } from './use-cases/get-academic-years.use-case.js';
import { UpdateAcademicYearUseCase } from './use-cases/update-academic-year.use-case.js';

@Module({
  controllers: [AcademicYearsController],
  providers: [
    AcademicYearsRepository,
    GetAcademicYearsUseCase,
    GetAcademicYearByIdUseCase,
    CreateAcademicYearUseCase,
    UpdateAcademicYearUseCase,
    DeleteAcademicYearUseCase,
    ActivateAcademicYearUseCase,
    DeactivateAcademicYearUseCase,
  ],
  exports: [AcademicYearsRepository],
})
export class AcademicYearsModule {}
