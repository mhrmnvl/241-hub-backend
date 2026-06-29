import { Injectable, NotFoundException } from '@nestjs/common';
import { PositionCategoriesRepository } from '../repositories/position-categories.repository.js';

@Injectable()
export class GetPositionCategoryByIdUseCase {
  constructor(private readonly repo: PositionCategoriesRepository) {}

  async execute(id: string) {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundException(`Position category with ID ${id} not found`);
    }
    return category;
  }
}
