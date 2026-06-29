import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearsRepository } from '../repositories/academic-years.repository.js';

@Injectable()
export class DeactivateAcademicYearUseCase {
  private readonly logger = new Logger(DeactivateAcademicYearUseCase.name);

  constructor(private readonly repository: AcademicYearsRepository) {}

  async execute(schoolUnitId: string, id: string) {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new NotFoundException(`Academic Year with ID ${id} not found`);
    }

    if (!current.isActive) {
      return current;
    }

    const activeCount = await this.repository.countActive(schoolUnitId);
    if (activeCount <= 1) {
      throw new BadRequestException(
        'Cannot deactivate the only active academic year. Activate another one first.',
      );
    }

    const hasData = await this.repository.hasRelatedData(id);
    if (hasData) {
      this.logger.warn(
        `Deactivating academic year ${id} that has enrollment data`,
      );
    }

    const deactivated = await this.repository.update(id, { isActive: false });

    const { count } =
      await this.repository.deactivateSemestersByAcademicYearId(id);
    if (count > 0) {
      this.logger.log(`Cascade deactivated ${count} semester(s) for AY ${id}`);
    }

    this.logger.log(`Academic Year deactivated: ${id}`);
    return deactivated;
  }
}
