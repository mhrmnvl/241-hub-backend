import { Injectable } from '@nestjs/common';
import { TeachingAssignmentQueryDto } from '../dto/teaching-assignment-query.dto.js';
import { TeachingAssignmentsRepository } from '../repositories/teaching-assignments.repository.js';

@Injectable()
export class GetTeachingAssignmentsUseCase {
  constructor(private readonly repo: TeachingAssignmentsRepository) {}

  async execute(query: TeachingAssignmentQueryDto) {
    return this.repo.findAll(query);
  }
}
