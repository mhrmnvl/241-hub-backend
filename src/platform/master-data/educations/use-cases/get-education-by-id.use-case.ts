import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationsRepository } from '../repositories/educations.repository.js';

@Injectable()
export class GetEducationByIdUseCase {
  constructor(private readonly repository: EducationsRepository) {}

  async execute(id: string) {
    const education = await this.repository.findById(id);
    if (!education)
      throw new NotFoundException(`Education with ID ${id} not found`);
    return education;
  }
}
