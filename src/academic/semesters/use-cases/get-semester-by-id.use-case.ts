import { Injectable, NotFoundException } from '@nestjs/common';
import { SemestersRepository } from '../repositories/semesters.repository.js';

@Injectable()
export class GetSemesterByIdUseCase {
  constructor(private readonly repository: SemestersRepository) {}

  async execute(id: string) {
    const semester = await this.repository.findById(id);
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }
    return semester;
  }
}
