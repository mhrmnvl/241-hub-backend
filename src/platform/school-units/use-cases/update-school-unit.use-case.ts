import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateSchoolUnitDto } from '../dto/update-school-unit.dto.js';
import { SchoolUnitsRepository } from '../repositories/school-units.repository.js';

@Injectable()
export class UpdateSchoolUnitUseCase {
  private readonly logger = new Logger(UpdateSchoolUnitUseCase.name);

  constructor(private readonly repo: SchoolUnitsRepository) {}

  async execute(schoolUnitId: string, dto: UpdateSchoolUnitDto) {
    const existing = await this.repo.findById(schoolUnitId);
    if (!existing) {
      throw new NotFoundException('School unit has not been set up yet');
    }

    const schoolUnit = await this.repo.update(schoolUnitId, dto);
    this.logger.log(`School unit updated: ${schoolUnit.name}`);
    return schoolUnit;
  }
}
