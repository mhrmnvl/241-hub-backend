import { Module } from '@nestjs/common';
import { PositionsController } from './controllers/positions.controller.js';
import { PositionsRepository } from './repositories/positions.repository.js';
import { CreatePositionUseCase } from './use-cases/create-position.use-case.js';
import { DeletePositionUseCase } from './use-cases/delete-position.use-case.js';
import { GetPositionByIdUseCase } from './use-cases/get-position-by-id.use-case.js';
import { GetPositionsUseCase } from './use-cases/get-positions.use-case.js';
import { UpdatePositionUseCase } from './use-cases/update-position.use-case.js';

@Module({
  controllers: [PositionsController],
  providers: [
    PositionsRepository,
    GetPositionsUseCase,
    GetPositionByIdUseCase,
    CreatePositionUseCase,
    UpdatePositionUseCase,
    DeletePositionUseCase,
  ],
  exports: [PositionsRepository],
})
export class PositionsModule {}
