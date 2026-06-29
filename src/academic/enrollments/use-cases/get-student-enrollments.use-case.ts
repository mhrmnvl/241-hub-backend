import { Injectable } from '@nestjs/common';
import { StudentEnrollmentQueryDto } from '../dto/student-enrollment-query.dto.js';
import { EnrollmentsRepository } from '../repositories/enrollments.repository.js';

@Injectable()
export class GetStudentEnrollmentsUseCase {
  constructor(private readonly repo: EnrollmentsRepository) {}
  async execute(query: StudentEnrollmentQueryDto) {
    return this.repo.findAll(query);
  }
}
