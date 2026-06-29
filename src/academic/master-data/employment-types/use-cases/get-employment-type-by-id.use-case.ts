import { Injectable, NotFoundException } from '@nestjs/common';
import { EmploymentTypesRepository } from '../repositories/employment-types.repository.js';

@Injectable()
export class GetEmploymentTypeByIdUseCase {
  constructor(private readonly repo: EmploymentTypesRepository) {}

  async execute(schoolUnitId: string, id: string) {
    const type = await this.repo.findById(schoolUnitId, id);
    if (!type) {
      throw new NotFoundException(`Employment type with ID ${id} not found`);
    }
    return type;
  }
}
