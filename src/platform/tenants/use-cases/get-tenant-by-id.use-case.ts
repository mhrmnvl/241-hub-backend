import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantsRepository } from '../repositories/tenants.repository.js';

@Injectable()
export class GetTenantByIdUseCase {
  constructor(private readonly repo: TenantsRepository) {}

  async execute(id: string) {
    const tenant = await this.repo.findById(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }
}
