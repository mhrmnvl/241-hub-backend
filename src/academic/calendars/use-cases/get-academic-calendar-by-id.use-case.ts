import { Injectable, NotFoundException } from '@nestjs/common';
import { AcademicCalendarsRepository } from '../repositories/academic-calendars.repository.js';

@Injectable()
export class GetAcademicCalendarByIdUseCase {
  constructor(private readonly repo: AcademicCalendarsRepository) {}

  async execute(id: string) {
    const calendar = await this.repo.findById(id);
    if (!calendar) {
      throw new NotFoundException(`Academic calendar with id ${id} not found`);
    }
    return calendar;
  }
}
