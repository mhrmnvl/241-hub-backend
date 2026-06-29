import { Injectable, NotFoundException } from '@nestjs/common';
import { ScholarshipsRepository } from '../repositories/scholarships.repository.js';
import { UpdateScholarshipDto } from '../dto/update-scholarship.dto.js';

@Injectable()
export class UpdateScholarshipUseCase {
  constructor(private readonly repo: ScholarshipsRepository) {}

  async execute(id: string, dto: UpdateScholarshipDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Scholarship not found');
    return this.repo.update(id, dto);
  }
}
