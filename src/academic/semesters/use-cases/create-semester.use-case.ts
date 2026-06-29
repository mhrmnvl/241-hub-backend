import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { CreateSemesterDto } from '../dto/create-semester.dto.js';
import { SemestersRepository } from '../repositories/semesters.repository.js';

@Injectable()
export class CreateSemesterUseCase {
  private readonly logger = new Logger(CreateSemesterUseCase.name);

  constructor(
    private readonly repository: SemestersRepository,
    private readonly academicYearRepository: AcademicYearsRepository,
  ) {}

  async execute(dto: CreateSemesterDto) {
    const academicYear = await this.academicYearRepository.findById(
      dto.academicYearId,
    );
    if (!academicYear) {
      throw new NotFoundException(
        `Academic Year with ID ${dto.academicYearId} not found`,
      );
    }

    const existing = await this.repository.findByAcademicYearAndType(
      dto.academicYearId,
      dto.type,
    );
    if (existing) {
      throw new ConflictException(
        `Semester ${dto.type} for Academic Year "${academicYear.name}" already exists`,
      );
    }

    if (dto.startDate && dto.endDate) {
      if (new Date(dto.endDate) <= new Date(dto.startDate)) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    if (dto.isActive) {
      await this.repository.deactivateAll();
    }

    const semester = await this.repository.create({
      academicYearId: dto.academicYearId,
      type: dto.type,
      isActive: dto.isActive ?? false,
      ...(dto.startDate && { startDate: new Date(dto.startDate) }),
      ...(dto.endDate && { endDate: new Date(dto.endDate) }),
    });

    this.logger.log(`Semester created: ${dto.type} - ${academicYear.name}`);
    return semester;
  }
}
