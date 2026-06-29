import { Injectable, NotFoundException } from '@nestjs/common';
import { CurriculaRepository } from '../repositories/curricula.repository.js';

@Injectable()
export class GetCurriculaByIdUseCase {
  constructor(private readonly repository: CurriculaRepository) {}

  async execute(id: string) {
    const curricula = await this.repository.findById(id);
    if (!curricula) {
      throw new NotFoundException(`Curricula with ID ${id} not found`);
    }
    return curricula;
  }
}
