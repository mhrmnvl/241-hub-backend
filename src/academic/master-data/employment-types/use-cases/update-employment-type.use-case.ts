import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateEmploymentTypeDto } from '../dto/create-employment-type.dto.js';
import { EmploymentTypesRepository } from '../repositories/employment-types.repository.js';

@Injectable()
export class UpdateEmploymentTypeUseCase {
  private readonly logger = new Logger(UpdateEmploymentTypeUseCase.name);

  constructor(private readonly repo: EmploymentTypesRepository) {}

  async execute(
    schoolUnitId: string,
    id: string,
    dto: UpdateEmploymentTypeDto,
  ) {
    const existing = await this.repo.findById(schoolUnitId, id);
    if (!existing) {
      throw new NotFoundException(`Employment type with ID ${id} not found`);
    }

    const type = await this.repo.update(schoolUnitId, id, dto);
    this.logger.log(
      `Employment type updated: ${id} in school unit ${schoolUnitId}`,
    );
    return type;
  }
}
