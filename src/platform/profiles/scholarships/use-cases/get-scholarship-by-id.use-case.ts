import { Injectable, NotFoundException } from '@nestjs/common';
import { ScholarshipsRepository } from '../repositories/scholarships.repository.js';

@Injectable()
export class GetScholarshipByIdUseCase {
  constructor(private readonly repo: ScholarshipsRepository) {}

  async execute(id: string) {
    const scholarship = await this.repo.findById(id);
    if (!scholarship) throw new NotFoundException('Scholarship not found');
    return scholarship;
  }
}
