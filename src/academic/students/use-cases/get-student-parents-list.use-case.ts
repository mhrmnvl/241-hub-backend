import { Injectable } from '@nestjs/common';
import { StudentParentQueryDto } from '../dto/student-parent-query.dto.js';
import { StudentParentsRepository } from '../repositories/student-parents.repository.js';

@Injectable()
export class GetStudentParentsListUseCase {
  constructor(private readonly repo: StudentParentsRepository) {}

  async execute(query: StudentParentQueryDto) {
    const { data, total, page, limit } = await this.repo.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
