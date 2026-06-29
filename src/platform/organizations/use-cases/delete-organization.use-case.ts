import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from '../repositories/organizations.repository.js';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(private readonly repo: OrganizationsRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    await this.repo.softDelete(id);
  }
}
