import { Injectable } from '@nestjs/common';
import { TeacherQueryDto } from '../dto/request/teachers-query.request.dto.js';
import { TeachersRepository } from '../repositories/teachers.repository.js';

@Injectable()
export class GetTeachersUseCase {
  constructor(private readonly repository: TeachersRepository) {}

  async execute(query: TeacherQueryDto) {
    const { data, total, page, limit } = await this.repository.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
