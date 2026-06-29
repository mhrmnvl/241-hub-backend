import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../core/database/prisma.module.js';
import { EducationalHistoriesController } from './controllers/educational-histories.controller.js';
import { EducationalHistoriesRepository } from './repositories/educational-histories.repository.js';
import { CreateEducationalHistoryUseCase } from './use-cases/create-educational-history.use-case.js';
import { GetEducationalHistoriesUseCase } from './use-cases/get-educational-histories.use-case.js';
import { GetEducationalHistoryByIdUseCase } from './use-cases/get-educational-history-by-id.use-case.js';
import { UpdateEducationalHistoryUseCase } from './use-cases/update-educational-history.use-case.js';
import { DeleteEducationalHistoryUseCase } from './use-cases/delete-educational-history.use-case.js';

@Module({
  imports: [PrismaModule],
  controllers: [EducationalHistoriesController],
  providers: [
    EducationalHistoriesRepository,
    CreateEducationalHistoryUseCase,
    GetEducationalHistoriesUseCase,
    GetEducationalHistoryByIdUseCase,
    UpdateEducationalHistoryUseCase,
    DeleteEducationalHistoryUseCase,
  ],
})
export class EducationalHistoriesModule {}
