import { Injectable, NotFoundException } from '@nestjs/common';
import { TeachersRepository } from '../repositories/teachers.repository.js';

@Injectable()
export class ToggleTeacherActiveUseCase {
  constructor(private readonly repo: TeachersRepository) {}

  async execute(id: string, isActive: boolean) {
    const teacher = await this.repo.findById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return this.repo.toggleUserActive(teacher.user.id, isActive);
  }
}
