import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AcademicYearsRepository } from '../repositories/academic-years.repository.js';

@Injectable()
export class ActivateAcademicYearUseCase {
  private readonly logger = new Logger(ActivateAcademicYearUseCase.name);

  constructor(private readonly repository: AcademicYearsRepository) {}

  async execute(schoolUnitId: string, id: string) {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new NotFoundException(`Academic Year with ID ${id} not found`);
    }

    if (current.isActive) {
      return current;
    }

    const activated = await this.repository.activateById(schoolUnitId, id);
    this.logger.log(`Academic Year activated: ${id}`);
    return activated;
  }
}
