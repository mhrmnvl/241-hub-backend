import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { SemestersRepository } from '../repositories/semesters.repository.js';

@Injectable()
export class ActivateSemesterUseCase {
  private readonly logger = new Logger(ActivateSemesterUseCase.name);

  constructor(
    private readonly repository: SemestersRepository,
    private readonly academicYearRepository: AcademicYearsRepository,
  ) {}

  async execute(id: string) {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    if (current.isActive) {
      return current;
    }

    const academicYear = await this.academicYearRepository.findById(
      current.academicYear.id,
    );
    if (!academicYear?.isActive) {
      throw new BadRequestException(
        'Cannot activate semester: its academic year is not active',
      );
    }

    const activated = await this.repository.activateById(id);
    this.logger.log(`Semester activated: ${id}`);
    return activated;
  }
}
