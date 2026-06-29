import { Injectable, NotFoundException } from '@nestjs/common';
import { SchoolUnitsRepository } from '../repositories/school-units.repository.js';

@Injectable()
export class GetSchoolUnitUseCase {
  constructor(private readonly repo: SchoolUnitsRepository) {}

  async execute(schoolUnitId: string) {
    const schoolUnit = await this.repo.findById(schoolUnitId);
    if (!schoolUnit) {
      throw new NotFoundException('School unit has not been set up yet');
    }
    return schoolUnit;
  }
}
