import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from '../dto/create-tenant.dto.js';
import { TenantsRepository } from '../repositories/tenants.repository.js';

@Injectable()
export class CreateTenantUseCase {
  constructor(private readonly repo: TenantsRepository) {}

  async execute(dto: CreateTenantDto) {
    const existing = await this.repo.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Tenant with slug ${dto.slug} already exists`);
    }
    return this.repo.create(dto);
  }
}
