import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller.js';
import { RolesRepository } from './repositories/roles.repository.js';
import { UsersModule } from '../../users/users.module.js';
import { OrganizationsModule } from '../../organizations/organizations.module.js';
import { CreateRoleUseCase } from './use-cases/create-role.use-case.js';
import { GetRolesUseCase } from './use-cases/get-roles.use-case.js';
import { GetRoleByIdUseCase } from './use-cases/get-role-by-id.use-case.js';
import { UpdateRoleUseCase } from './use-cases/update-role.use-case.js';
import { DeleteRoleUseCase } from './use-cases/delete-role.use-case.js';
import { AssignRoleToUserUseCase } from './use-cases/assign-role-to-user.use-case.js';
import { RemoveRoleFromUserUseCase } from './use-cases/remove-role-from-user.use-case.js';
import { AuthModule } from '../../auth/auth.module.js';

@Module({
  imports: [UsersModule, OrganizationsModule, AuthModule],
  controllers: [RolesController],
  providers: [
    RolesRepository,
    CreateRoleUseCase,
    GetRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    AssignRoleToUserUseCase,
    RemoveRoleFromUserUseCase,
  ],
  exports: [RolesRepository],
})
export class RolesModule {}
