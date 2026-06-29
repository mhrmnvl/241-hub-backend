import { Injectable, NotFoundException } from '@nestjs/common';
import { SemestersRepository } from '../../semesters/index.js';
import { UpdateAcademicCalendarDto } from '../dto/update-academic-calendar.dto.js';
import { AcademicCalendarsRepository } from '../repositories/academic-calendars.repository.js';

@Injectable()
export class UpdateAcademicCalendarUseCase {
  constructor(
    private readonly repo: AcademicCalendarsRepository,
    private readonly semesterRepository: SemestersRepository,
  ) {}

  async execute(id: string, dto: UpdateAcademicCalendarDto) {
    const calendar = await this.repo.findById(id);
    if (!calendar) {
      throw new NotFoundException(`Academic calendar with id ${id} not found`);
    }

    if (dto.semesterId) {
      const semester = await this.semesterRepository.findById(dto.semesterId);
      if (!semester) {
        throw new NotFoundException(
          `Semester with id ${dto.semesterId} not found`,
        );
      }
    }

    return this.repo.update(id, dto);
  }
}
