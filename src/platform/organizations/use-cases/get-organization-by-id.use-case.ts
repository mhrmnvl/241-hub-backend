import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from '../repositories/organizations.repository.js';

@Injectable()
export class GetOrganizationByIdUseCase {
  constructor(private readonly repo: OrganizationsRepository) {}

  async execute(id: string) {
    const org = await this.repo.findById(id);
    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }
}
