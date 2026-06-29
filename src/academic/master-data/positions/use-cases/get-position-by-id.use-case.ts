import { Injectable, NotFoundException } from '@nestjs/common';
import { PositionsRepository } from '../repositories/positions.repository.js';

@Injectable()
export class GetPositionByIdUseCase {
  constructor(private readonly repo: PositionsRepository) {}

  async execute(id: string) {
    const position = await this.repo.findById(id);
    if (!position)
      throw new NotFoundException(`Position with ID ${id} not found`);
    return position;
  }
}
