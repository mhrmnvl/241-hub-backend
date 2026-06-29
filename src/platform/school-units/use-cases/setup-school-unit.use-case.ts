import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateSchoolUnitDto } from '../dto/create-school-unit.dto.js';
import { SchoolUnitsRepository } from '../repositories/school-units.repository.js';

@Injectable()
export class SetupSchoolUnitUseCase {
  private readonly logger = new Logger(SetupSchoolUnitUseCase.name);

  constructor(private readonly repo: SchoolUnitsRepository) {}

  async execute(organizationId: string, dto: CreateSchoolUnitDto) {
    if (dto.subdomain) {
      const existing = await this.repo.findByDomain(
        `${dto.subdomain}.schoolhub.id`,
      );
      if (existing) {
        throw new ConflictException('School unit subdomain already exists');
      }
    }

    if (dto.customDomain) {
      const existing = await this.repo.findByDomain(dto.customDomain);
      if (existing) {
        throw new ConflictException('School unit custom domain already exists');
      }
    }

    const schoolUnit = await this.repo.create(organizationId, dto);
    this.logger.log(`School unit created: ${schoolUnit.name}`);
    return schoolUnit;
  }
}
