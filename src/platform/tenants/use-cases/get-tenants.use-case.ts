import { Injectable } from '@nestjs/common';
import { TenantsRepository } from '../repositories/tenants.repository.js';

@Injectable()
export class GetTenantsUseCase {
  constructor(private readonly repo: TenantsRepository) {}

  async execute() {
    const tenants = await this.repo.findMany();
    return tenants.map((tenant) => ({
      ...tenant,
      plan: tenant.plan
        ? { ...tenant.plan, storageLimit: Number(tenant.plan.storageLimit) }
        : tenant.plan,
    }));
  }
}
