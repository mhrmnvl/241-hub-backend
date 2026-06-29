import { Injectable, NotFoundException } from '@nestjs/common';
import { OccupationsRepository } from '../repositories/occupations.repository.js';

@Injectable()
export class GetOccupationByIdUseCase {
  constructor(private readonly repo: OccupationsRepository) {}

  async execute(id: string) {
    const occupation = await this.repo.findById(id);
    if (!occupation)
      throw new NotFoundException(`Occupation with ID ${id} not found`);
    return occupation;
  }
}
