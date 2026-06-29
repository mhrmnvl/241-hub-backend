import { Injectable } from '@nestjs/common';
import { EducationQueryDto } from '../dto/education-query.dto.js';
import { EducationsRepository } from '../repositories/educations.repository.js';

@Injectable()
export class GetEducationsUseCase {
  constructor(private readonly repository: EducationsRepository) {}

  async execute(query: EducationQueryDto) {
    const { data, total, page, limit } = await this.repository.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
