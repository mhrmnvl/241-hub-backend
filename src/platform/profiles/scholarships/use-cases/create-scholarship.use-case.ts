import { Injectable } from '@nestjs/common';
import { ScholarshipsRepository } from '../repositories/scholarships.repository.js';
import { CreateScholarshipDto } from '../dto/create-scholarship.dto.js';

@Injectable()
export class CreateScholarshipUseCase {
  constructor(private readonly repo: ScholarshipsRepository) {}

  async execute(dto: CreateScholarshipDto) {
    return this.repo.create(dto);
  }
}
