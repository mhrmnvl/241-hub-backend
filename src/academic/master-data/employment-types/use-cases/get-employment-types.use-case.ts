import { Injectable } from '@nestjs/common';
import { EmploymentTypeQueryDto } from '../dto/employment-type-query.dto.js';
import { EmploymentTypesRepository } from '../repositories/employment-types.repository.js';

@Injectable()
export class GetEmploymentTypesUseCase {
  constructor(private readonly repo: EmploymentTypesRepository) {}

  async execute(schoolUnitId: string, query: EmploymentTypeQueryDto) {
    return this.repo.findAll(schoolUnitId, query);
  }
}
