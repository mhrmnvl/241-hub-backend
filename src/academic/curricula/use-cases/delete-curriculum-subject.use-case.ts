import { Injectable, NotFoundException } from '@nestjs/common';
import { CurriculumSubjectsRepository } from '../repositories/curriculum-subjects.repository.js';

@Injectable()
export class DeleteCurriculumSubjectUseCase {
  constructor(private readonly repository: CurriculumSubjectsRepository) {}

  async execute(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw new NotFoundException(`CurriculumSubject with ID ${id} not found`);
    return this.repository.softDelete(id);
  }
}
