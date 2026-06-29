import { Injectable } from '@nestjs/common';
import { SemesterQueryDto } from '../dto/semester-query.dto.js';
import { SemestersRepository } from '../repositories/semesters.repository.js';

@Injectable()
export class GetSemestersUseCase {
  constructor(private readonly repository: SemestersRepository) {}

  async execute(query: SemesterQueryDto) {
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
