import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../../../shared/dto/address.dto.js';
import { SchoolUnitsRepository } from '../repositories/school-units.repository.js';
import { SchoolUnitAddressesRepository } from '../repositories/school-unit-addresses.repository.js';

@Injectable()
export class SchoolUnitAddressUseCase {
  private readonly logger = new Logger(SchoolUnitAddressUseCase.name);

  constructor(
    private readonly schoolUnitsRepo: SchoolUnitsRepository,
    private readonly repo: SchoolUnitAddressesRepository,
  ) {}

  async getAddress(schoolUnitId: string) {
    await this.requireSchoolUnitId(schoolUnitId);
    const address = await this.repo.findBySchoolUnit(schoolUnitId);
    if (!address) {
      throw new NotFoundException('School unit address has not been set yet');
    }
    return address;
  }

  async setAddress(schoolUnitId: string, dto: CreateAddressDto) {
    await this.requireSchoolUnitId(schoolUnitId);
    const existing = await this.repo.findBySchoolUnitRaw(schoolUnitId);
    if (existing) {
      throw new ConflictException(
        'School unit address already exists. Use PATCH to update.',
      );
    }

    const address = await this.repo.create(schoolUnitId, dto);
    this.logger.log(`School unit address set for school unit ${schoolUnitId}`);
    return address;
  }

  async updateAddress(schoolUnitId: string, dto: UpdateAddressDto) {
    await this.requireSchoolUnitId(schoolUnitId);
    const existing = await this.repo.findBySchoolUnitRaw(schoolUnitId);
    if (!existing) {
      throw new NotFoundException('School unit address has not been set yet');
    }

    const updated = await this.repo.update(existing.id, dto);
    this.logger.log(
      `School unit address updated for school unit ${schoolUnitId}`,
    );
    return updated;
  }

  async removeAddress(schoolUnitId: string): Promise<void> {
    await this.requireSchoolUnitId(schoolUnitId);
    const existing = await this.repo.findBySchoolUnitRaw(schoolUnitId);
    if (!existing) {
      throw new NotFoundException('School unit address has not been set yet');
    }

    await this.repo.remove(existing.id);
    this.logger.log(
      `School unit address removed for school unit ${schoolUnitId}`,
    );
  }

  private async requireSchoolUnitId(schoolUnitId: string): Promise<string> {
    const schoolUnit = await this.schoolUnitsRepo.findById(schoolUnitId);
    if (!schoolUnit) {
      throw new NotFoundException('School unit has not been set up yet');
    }
    return schoolUnitId;
  }
}
