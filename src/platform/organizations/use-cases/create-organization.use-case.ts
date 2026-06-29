import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto.js';
import { OrganizationsRepository } from '../repositories/organizations.repository.js';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(private readonly repo: OrganizationsRepository) {}

  async execute(dto: CreateOrganizationDto) {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(
        `Organization with code ${dto.code} already exists`,
      );
    }
    return this.repo.create(dto);
  }
}
