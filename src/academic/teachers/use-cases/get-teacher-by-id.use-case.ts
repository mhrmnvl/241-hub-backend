import { Injectable, NotFoundException } from '@nestjs/common';
import { TeachersRepository } from '../repositories/teachers.repository.js';

@Injectable()
export class GetTeacherByIdUseCase {
  constructor(private readonly repository: TeachersRepository) {}

  async execute(id: string) {
    const teacher = await this.repository.findById(id);
    if (!teacher)
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    return teacher;
  }
}
