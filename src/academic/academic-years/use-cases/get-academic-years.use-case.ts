import { Injectable } from '@nestjs/common';
import { AcademicYearQueryDto } from '../dto/academic-year-query.dto.js';
import { AcademicYearsRepository } from '../repositories/academic-years.repository.js';

@Injectable()
export class GetAcademicYearsUseCase {
  constructor(private readonly repository: AcademicYearsRepository) {}

  async execute(schoolUnitId: string, query: AcademicYearQueryDto) {
    const { data, total, page, limit } = await this.repository.findAll(schoolUnitId, query);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
