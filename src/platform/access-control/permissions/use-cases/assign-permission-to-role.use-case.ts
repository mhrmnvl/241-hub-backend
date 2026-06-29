import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PermissionsRepository } from '../repositories/permissions.repository.js';
import { RolesRepository } from '../../roles/repositories/roles.repository.js';

@Injectable()
export class AssignPermissionToRoleUseCase {
  private readonly logger = new Logger(AssignPermissionToRoleUseCase.name);

  constructor(
    private readonly permissionsRepo: PermissionsRepository,
    private readonly rolesRepo: RolesRepository,
  ) {}

  async execute(roleId: string, permissionId: string, organizationId: string) {
    const role = await this.rolesRepo.findById(roleId, organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    if (role.isSystem) {
      throw new ForbiddenException(
        'Permissions of system roles cannot be modified',
      );
    }

    const permission = await this.permissionsRepo.findById(permissionId);
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    const existingRelation = await this.permissionsRepo.findRolePermission(
      roleId,
      permissionId,
    );
    if (existingRelation) {
      throw new ConflictException('Role already has this permission');
    }

    await this.permissionsRepo.assignPermissionToRole(roleId, permissionId);
    this.logger.log(
      `Permission ${permission.code} assigned to role ${role.code}`,
    );
  }
}
