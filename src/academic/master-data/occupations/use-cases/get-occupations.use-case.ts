import { Injectable } from '@nestjs/common';
import { OccupationQueryDto } from '../dto/occupation-query.dto.js';
import { OccupationsRepository } from '../repositories/occupations.repository.js';

@Injectable()
export class GetOccupationsUseCase {
  constructor(private readonly repo: OccupationsRepository) {}

  async execute(query: OccupationQueryDto) {
    const { data, total, page, limit } = await this.repo.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
