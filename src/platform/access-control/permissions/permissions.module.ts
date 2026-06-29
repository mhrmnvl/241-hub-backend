import { Module } from '@nestjs/common';
import { PermissionsController } from './controllers/permissions.controller.js';
import { PermissionsRepository } from './repositories/permissions.repository.js';
import { GetPermissionsUseCase } from './use-cases/get-permissions.use-case.js';
import { GetPermissionByIdUseCase } from './use-cases/get-permission-by-id.use-case.js';
import { AssignPermissionToRoleUseCase } from './use-cases/assign-permission-to-role.use-case.js';
import { RemovePermissionFromRoleUseCase } from './use-cases/remove-permission-from-role.use-case.js';
import { SyncPermissionsUseCase } from './use-cases/sync-permissions.use-case.js';
import { PermissionsGuard } from './guards/permissions.guard.js';
import { RolesModule } from '../roles/roles.module.js';
import { OrganizationsModule } from '../../organizations/organizations.module.js';
import { AuthModule } from '../../auth/auth.module.js';

@Module({
  imports: [RolesModule, OrganizationsModule, AuthModule],
  controllers: [PermissionsController],
  providers: [
    PermissionsRepository,
    GetPermissionsUseCase,
    GetPermissionByIdUseCase,
    AssignPermissionToRoleUseCase,
    RemovePermissionFromRoleUseCase,
    SyncPermissionsUseCase,
    PermissionsGuard,
  ],
  exports: [PermissionsRepository, PermissionsGuard],
})
export class PermissionsModule {}
