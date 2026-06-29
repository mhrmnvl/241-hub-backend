import { Module } from '@nestjs/common';
import { OccupationsController } from './controllers/occupations.controller.js';
import { OccupationsRepository } from './repositories/occupations.repository.js';
import { CreateOccupationUseCase } from './use-cases/create-occupation.use-case.js';
import { DeleteOccupationUseCase } from './use-cases/delete-occupation.use-case.js';
import { GetOccupationByIdUseCase } from './use-cases/get-occupation-by-id.use-case.js';
import { GetOccupationsUseCase } from './use-cases/get-occupations.use-case.js';
import { UpdateOccupationUseCase } from './use-cases/update-occupation.use-case.js';

@Module({
  controllers: [OccupationsController],
  providers: [
    OccupationsRepository,
    GetOccupationsUseCase,
    GetOccupationByIdUseCase,
    CreateOccupationUseCase,
    UpdateOccupationUseCase,
    DeleteOccupationUseCase,
  ],
  exports: [OccupationsRepository],
})
export class OccupationsModule {}
