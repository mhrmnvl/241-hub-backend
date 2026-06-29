import { Injectable } from '@nestjs/common';
import { ParentQueryDto } from '../dto/parent-query.dto.js';
import { ParentsRepository } from '../repositories/parents.repository.js';

@Injectable()
export class GetParentsUseCase {
  constructor(private readonly repo: ParentsRepository) {}

  async execute(query: ParentQueryDto) {
    const { data, total, page, limit } = await this.repo.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
