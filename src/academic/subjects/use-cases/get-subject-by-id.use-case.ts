import { Injectable, NotFoundException } from '@nestjs/common';
import { SubjectsRepository } from '../repositories/subjects.repository.js';

@Injectable()
export class GetSubjectByIdUseCase {
  constructor(private readonly repo: SubjectsRepository) {}

  async execute(id: string) {
    const subject = await this.repo.findById(id);
    if (!subject)
      throw new NotFoundException(`Subject with ID ${id} not found`);
    return subject;
  }
}
