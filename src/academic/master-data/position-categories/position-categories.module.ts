import { Module } from '@nestjs/common';
import { PositionCategoriesController } from './controllers/position-categories.controller.js';
import { PositionCategoriesRepository } from './repositories/position-categories.repository.js';
import { CreatePositionCategoryUseCase } from './use-cases/create-position-category.use-case.js';
import { GetPositionCategoriesUseCase } from './use-cases/get-position-categories.use-case.js';
import { GetPositionCategoryByIdUseCase } from './use-cases/get-position-category-by-id.use-case.js';
import { UpdatePositionCategoryUseCase } from './use-cases/update-position-category.use-case.js';
import { DeletePositionCategoryUseCase } from './use-cases/delete-position-category.use-case.js';

@Module({
  controllers: [PositionCategoriesController],
  providers: [
    PositionCategoriesRepository,
    CreatePositionCategoryUseCase,
    GetPositionCategoriesUseCase,
    GetPositionCategoryByIdUseCase,
    UpdatePositionCategoryUseCase,
    DeletePositionCategoryUseCase,
  ],
  exports: [PositionCategoriesRepository],
})
export class PositionCategoriesModule {}
