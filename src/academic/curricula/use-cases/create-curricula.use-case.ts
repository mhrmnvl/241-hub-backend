import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { CreateCurriculaDto } from '../dto/create-curricula.dto.js';
import { CurriculaRepository } from '../repositories/curricula.repository.js';

@Injectable()
export class CreateCurriculaUseCase {
  private readonly logger = new Logger(CreateCurriculaUseCase.name);

  constructor(
    private readonly repository: CurriculaRepository,
    private readonly academicYearRepository: AcademicYearsRepository,
  ) {}

  async execute(schoolUnitId: string, dto: CreateCurriculaDto) {
    const academicYear = await this.academicYearRepository.findById(
      dto.academicYearId,
    );
    if (!academicYear) {
      throw new NotFoundException(
        `Academic Year with ID ${dto.academicYearId} not found`,
      );
    }

    const existing = await this.repository.findByNameAndAcademicYear(
      dto.name,
      dto.academicYearId,
    );
    if (existing) {
      throw new ConflictException(
        `Curricula with name "${dto.name}" already exists in this academic year`,
      );
    }

    const curricula = await this.repository.create(schoolUnitId, {
      academicYearId: dto.academicYearId,
      name: dto.name,
      isActive: dto.isActive,
    });

    this.logger.log(`Curricula created: ${dto.name}`);
    return curricula;
  }
}
