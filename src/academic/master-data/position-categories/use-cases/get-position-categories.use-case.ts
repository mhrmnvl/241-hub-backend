import { Injectable } from '@nestjs/common';
import { PositionCategoryQueryDto } from '../dto/position-category-query.dto.js';
import { PositionCategoriesRepository } from '../repositories/position-categories.repository.js';

@Injectable()
export class GetPositionCategoriesUseCase {
  constructor(private readonly repo: PositionCategoriesRepository) {}

  async execute(query: PositionCategoryQueryDto) {
    return this.repo.findAll(query);
  }
}
