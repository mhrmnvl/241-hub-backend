import { Injectable } from '@nestjs/common';
import { ScholarshipsRepository } from '../repositories/scholarships.repository.js';
import { ScholarshipQueryDto } from '../dto/scholarship-query.dto.js';

@Injectable()
export class GetScholarshipsUseCase {
  constructor(private readonly repo: ScholarshipsRepository) {}

  async execute(query: ScholarshipQueryDto) {
    return this.repo.findAll(query);
  }
}
