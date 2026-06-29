import { Injectable } from '@nestjs/common';
import { StudentQueryDto } from '../dto/student-query.dto.js';
import { StudentsRepository } from '../repositories/students.repository.js';

@Injectable()
export class GetStudentsUseCase {
  constructor(private readonly repo: StudentsRepository) {}

  async execute(query: StudentQueryDto) {
    const { data, total, page, limit } = await this.repo.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
