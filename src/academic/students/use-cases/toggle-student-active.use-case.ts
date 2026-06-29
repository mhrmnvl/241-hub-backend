import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository.js';

@Injectable()
export class ToggleStudentActiveUseCase {
  constructor(private readonly repo: StudentsRepository) {}

  async execute(id: string, isActive: boolean) {
    const student = await this.repo.findById(id);
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return this.repo.toggleUserActive(student.user.id, isActive);
  }
}
