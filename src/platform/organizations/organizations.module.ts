import { Module } from '@nestjs/common';
import { OrganizationsController } from './controllers/organizations.controller.js';
import { OrganizationsRepository } from './repositories/organizations.repository.js';

// Use cases
import { CreateOrganizationUseCase } from './use-cases/create-organization.use-case.js';
import { GetOrganizationsUseCase } from './use-cases/get-organizations.use-case.js';
import { GetOrganizationByIdUseCase } from './use-cases/get-organization-by-id.use-case.js';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case.js';
import { DeleteOrganizationUseCase } from './use-cases/delete-organization.use-case.js';

@Module({
  controllers: [OrganizationsController],
  providers: [
    OrganizationsRepository,
    CreateOrganizationUseCase,
    GetOrganizationsUseCase,
    GetOrganizationByIdUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
  ],
  exports: [OrganizationsRepository],
})
export class OrganizationsModule {}
