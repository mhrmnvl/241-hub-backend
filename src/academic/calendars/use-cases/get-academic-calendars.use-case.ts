import { Injectable } from '@nestjs/common';
import { AcademicCalendarsRepository } from '../repositories/academic-calendars.repository.js';
import { AcademicCalendarQueryDto } from '../dto/academic-calendar-query.dto.js';

@Injectable()
export class GetAcademicCalendarsUseCase {
  constructor(private readonly repo: AcademicCalendarsRepository) {}

  async execute(query: AcademicCalendarQueryDto) {
    return this.repo.findAll(query);
  }
}
