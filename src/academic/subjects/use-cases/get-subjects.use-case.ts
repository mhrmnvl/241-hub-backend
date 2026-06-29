import { Injectable } from '@nestjs/common';
import { SubjectQueryDto } from '../dto/subject-query.dto.js';
import { SubjectsRepository } from '../repositories/subjects.repository.js';

@Injectable()
export class GetSubjectsUseCase {
  constructor(private readonly repo: SubjectsRepository) {}

  async execute(query: SubjectQueryDto) {
    const { data, total, page, limit } = await this.repo.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
