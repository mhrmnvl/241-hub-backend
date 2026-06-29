import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller.js';
import { TenantsRepository } from './repositories/tenants.repository.js';

// Use cases
import { CreateTenantUseCase } from './use-cases/create-tenant.use-case.js';
import { GetTenantsUseCase } from './use-cases/get-tenants.use-case.js';
import { GetTenantByIdUseCase } from './use-cases/get-tenant-by-id.use-case.js';
import { UpdateTenantUseCase } from './use-cases/update-tenant.use-case.js';
import { DeleteTenantUseCase } from './use-cases/delete-tenant.use-case.js';

@Module({
  controllers: [TenantsController],
  providers: [
    TenantsRepository,
    CreateTenantUseCase,
    GetTenantsUseCase,
    GetTenantByIdUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
  ],
  exports: [TenantsRepository],
})
export class TenantsModule {}
