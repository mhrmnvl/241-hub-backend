import { Injectable } from '@nestjs/common';
import { StudentGraduationQueryDto } from '../dto/student-graduation-query.dto.js';
import { GraduationsRepository } from '../repositories/graduations.repository.js';

@Injectable()
export class GetStudentGraduationsUseCase {
  constructor(private readonly repo: GraduationsRepository) {}
  async execute(query: StudentGraduationQueryDto) {
    return this.repo.findAll(query);
  }
}
