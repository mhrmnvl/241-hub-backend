import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { UpdateSemesterDto } from '../dto/update-semester.dto.js';
import { SemestersRepository } from '../repositories/semesters.repository.js';

@Injectable()
export class UpdateSemesterUseCase {
  private readonly logger = new Logger(UpdateSemesterUseCase.name);

  constructor(
    private readonly repository: SemestersRepository,
    private readonly academicYearRepository: AcademicYearsRepository,
  ) {}

  async execute(id: string, dto: UpdateSemesterDto) {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    if (dto.academicYearId && dto.academicYearId !== current.academicYear.id) {
      const academicYear = await this.academicYearRepository.findById(
        dto.academicYearId,
      );
      if (!academicYear) {
        throw new NotFoundException(
          `Academic Year with ID ${dto.academicYearId} not found`,
        );
      }
    }

    if (dto.type || dto.academicYearId) {
      const checkAyId = dto.academicYearId ?? current.academicYear.id;
      const checkType = dto.type ?? current.type;

      const existing = await this.repository.findByAcademicYearAndType(
        checkAyId,
        checkType,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Semester ${checkType} for this Academic Year already exists`,
        );
      }
    }

    const checkStartDate = dto.startDate ?? current.startDate;
    const checkEndDate = dto.endDate ?? current.endDate;

    if (checkStartDate && checkEndDate) {
      if (new Date(checkEndDate) <= new Date(checkStartDate)) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const updateData = {
      ...dto,
      ...(dto.startDate !== undefined && {
        startDate: dto.startDate ? new Date(dto.startDate) : null,
      }),
      ...(dto.endDate !== undefined && {
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      }),
    };

    const updated = await this.repository.update(id, updateData);
    this.logger.log(`Semester updated: ${id}`);
    return updated;
  }
}
