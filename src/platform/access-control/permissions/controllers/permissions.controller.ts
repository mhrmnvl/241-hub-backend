import { RequirePermissions } from '../decorators/require-permissions.decorator.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../../core/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../../../core/types/authenticated-user.type.js';
import { PermissionResponseDto } from '../dto/permission-response.dto.js';
import { AssignPermissionDto } from '../dto/assign-permission.dto.js';
import { GetPermissionsUseCase } from '../use-cases/get-permissions.use-case.js';
import { AssignPermissionToRoleUseCase } from '../use-cases/assign-permission-to-role.use-case.js';
import { RemovePermissionFromRoleUseCase } from '../use-cases/remove-permission-from-role.use-case.js';
import { SyncPermissionsUseCase } from '../use-cases/sync-permissions.use-case.js';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly assignPermissionToRoleUseCase: AssignPermissionToRoleUseCase,
    private readonly removePermissionFromRoleUseCase: RemovePermissionFromRoleUseCase,
    private readonly syncPermissionsUseCase: SyncPermissionsUseCase,
  ) {}

  @Get()
  @RequirePermissions('permissions.read')
  @ApiOperation({ summary: 'List all permissions in the system' })
  @ApiResponse({ status: 200, type: [PermissionResponseDto] })
  async findAll() {
    return this.getPermissionsUseCase.execute();
  }

  @Post('sync')
  @RequirePermissions('permissions.manage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync system permissions with the database' })
  @ApiResponse({ status: 200, description: 'Permissions synced successfully' })
  async sync() {
    await this.syncPermissionsUseCase.execute();
  }

  @Post('roles/:roleId')
  @RequirePermissions('permissions.manage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiParam({ name: 'roleId', description: 'Role UUID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Permission assigned successfully' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  @ApiResponse({ status: 409, description: 'Role already has this permission' })
  async assignPermission(
    @CurrentUser() user: AuthenticatedUser,
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() dto: AssignPermissionDto,
  ) {
    await this.assignPermissionToRoleUseCase.execute(
      roleId,
      dto.permissionId,
      user.organizationId,
    );
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @RequirePermissions('permissions.manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a permission from a role' })
  @ApiParam({ name: 'roleId', description: 'Role UUID', format: 'uuid' })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission UUID',
    format: 'uuid',
  })
  @ApiResponse({ status: 204, description: 'Permission removed successfully' })
  @ApiResponse({
    status: 404,
    description: 'Role, permission, or assignment not found',
  })
  async removePermission(
    @CurrentUser() user: AuthenticatedUser,
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    await this.removePermissionFromRoleUseCase.execute(
      roleId,
      permissionId,
      user.organizationId,
    );
  }
}
