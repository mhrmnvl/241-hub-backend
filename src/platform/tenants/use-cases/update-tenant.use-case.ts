import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTenantDto } from '../dto/update-tenant.dto.js';
import { TenantsRepository } from '../repositories/tenants.repository.js';

@Injectable()
export class UpdateTenantUseCase {
  constructor(private readonly repo: TenantsRepository) {}

  async execute(id: string, dto: UpdateTenantDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return this.repo.update(id, dto);
  }
}
