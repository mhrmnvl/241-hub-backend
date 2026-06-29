import { Injectable, NotFoundException } from '@nestjs/common';
import { AcademicYearsRepository } from '../repositories/academic-years.repository.js';

@Injectable()
export class GetAcademicYearByIdUseCase {
  constructor(private readonly repository: AcademicYearsRepository) {}

  async execute(id: string) {
    const year = await this.repository.findById(id);
    if (!year) {
      throw new NotFoundException(`Academic Year with ID ${id} not found`);
    }
    return year;
  }
}
