import { Injectable, NotFoundException } from '@nestjs/common';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { SemestersRepository } from '../../semesters/index.js';
import { CreateAcademicCalendarDto } from '../dto/create-academic-calendar.dto.js';
import { AcademicCalendarsRepository } from '../repositories/academic-calendars.repository.js';

@Injectable()
export class CreateAcademicCalendarUseCase {
  constructor(
    private readonly repo: AcademicCalendarsRepository,
    private readonly academicYearRepository: AcademicYearsRepository,
    private readonly semesterRepository: SemestersRepository,
  ) {}

  async execute(dto: CreateAcademicCalendarDto) {
    const academicYear = await this.academicYearRepository.findById(
      dto.academicYearId,
    );
    if (!academicYear) {
      throw new NotFoundException(
        `Academic year with id ${dto.academicYearId} not found`,
      );
    }

    if (dto.semesterId) {
      const semester = await this.semesterRepository.findById(dto.semesterId);
      if (!semester) {
        throw new NotFoundException(
          `Semester with id ${dto.semesterId} not found`,
        );
      }
    }

    return this.repo.create(dto);
  }
}
