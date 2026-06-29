import { Injectable } from '@nestjs/common';
import { CurriculaQueryDto } from '../dto/curricula-query.dto.js';
import { CurriculaRepository } from '../repositories/curricula.repository.js';

@Injectable()
export class GetCurriculaUseCase {
  constructor(private readonly repository: CurriculaRepository) {}

  async execute(query: CurriculaQueryDto) {
    const { data, total, page, limit } = await this.repository.findAll(query);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
