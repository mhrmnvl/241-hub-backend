import { Injectable } from '@nestjs/common';
import { CurriculumSubjectsRepository } from '../repositories/curriculum-subjects.repository.js';
import { CurriculumSubjectQueryDto } from '../dto/curriculum-subject-query.dto.js';

@Injectable()
export class GetCurriculumSubjectsUseCase {
  constructor(private readonly repository: CurriculumSubjectsRepository) {}

  async execute(query: CurriculumSubjectQueryDto) {
    return this.repository.findAll(query);
  }
}
