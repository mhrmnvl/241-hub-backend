import { Injectable, NotFoundException } from '@nestjs/common';
import { CurriculumSubjectsRepository } from '../repositories/curriculum-subjects.repository.js';

@Injectable()
export class GetCurriculumSubjectByIdUseCase {
  constructor(private readonly repository: CurriculumSubjectsRepository) {}

  async execute(id: string) {
    const result = await this.repository.findById(id);
    if (!result)
      throw new NotFoundException(`CurriculumSubject with ID ${id} not found`);
    return result;
  }
}
