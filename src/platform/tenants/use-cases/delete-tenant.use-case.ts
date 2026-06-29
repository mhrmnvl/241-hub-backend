import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantsRepository } from '../repositories/tenants.repository.js';

@Injectable()
export class DeleteTenantUseCase {
  constructor(private readonly repo: TenantsRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    await this.repo.softDelete(id);
  }
}
