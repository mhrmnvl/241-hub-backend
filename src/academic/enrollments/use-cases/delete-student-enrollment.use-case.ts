import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentsRepository } from '../repositories/enrollments.repository.js';

@Injectable()
export class DeleteStudentEnrollmentUseCase {
  constructor(private readonly repo: EnrollmentsRepository) {}
  async execute(id: string) {
    const enrollment = await this.repo.findById(id);
    if (!enrollment) {
      throw new NotFoundException(`StudentEnrollment ${id} not found`);
    }
    return this.repo.softDelete(id);
  }
}
