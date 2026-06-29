import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EmploymentTypesRepository } from '../repositories/employment-types.repository.js';

@Injectable()
export class DeleteEmploymentTypeUseCase {
  private readonly logger = new Logger(DeleteEmploymentTypeUseCase.name);

  constructor(private readonly repo: EmploymentTypesRepository) {}

  async execute(schoolUnitId: string, id: string) {
    const existing = await this.repo.findById(schoolUnitId, id);
    if (!existing) {
      throw new NotFoundException(`Employment type with ID ${id} not found`);
    }

    const inUseCount = await this.repo.countTeachersWithEmploymentType(id);
    if (inUseCount > 0) {
      throw new ConflictException(
        `Employment type is in use by ${inUseCount} teachers and cannot be deleted`,
      );
    }

    await this.repo.remove(schoolUnitId, id);
    this.logger.log(
      `Employment type deleted: ${id} in school unit ${schoolUnitId}`,
    );
  }
}
