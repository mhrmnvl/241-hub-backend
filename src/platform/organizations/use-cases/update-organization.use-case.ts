import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationDto } from '../dto/update-organization.dto.js';
import { OrganizationsRepository } from '../repositories/organizations.repository.js';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private readonly repo: OrganizationsRepository) {}

  async execute(id: string, dto: UpdateOrganizationDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return this.repo.update(id, dto);
  }
}
