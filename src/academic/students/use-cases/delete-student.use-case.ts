import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository.js';

@Injectable()
export class DeleteStudentUseCase {
  private readonly logger = new Logger(DeleteStudentUseCase.name);

  constructor(private readonly repo: StudentsRepository) {}

  async execute(id: string): Promise<void> {
    const student = await this.repo.findById(id);
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);

    await this.repo.softDelete(id, student.user.id);
    this.logger.log(`Student soft-deleted: ${id}`);
  }
}
