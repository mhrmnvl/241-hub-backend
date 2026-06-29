import { Injectable, NotFoundException } from '@nestjs/common';
import { TeachingAssignmentsRepository } from '../repositories/teaching-assignments.repository.js';

@Injectable()
export class GetTeachingAssignmentByIdUseCase {
  constructor(private readonly repo: TeachingAssignmentsRepository) {}

  async execute(id: string) {
    const result = await this.repo.findById(id);
    if (!result)
      throw new NotFoundException(`Teaching assignment ${id} not found`);
    return result;
  }
}
