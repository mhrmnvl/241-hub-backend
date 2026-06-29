import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CreateRoleDto } from '../dto/create-role.dto.js';
import { UpdateRoleDto } from '../dto/update-role.dto.js';
import { AssignRoleDto } from '../dto/assign-role.dto.js';
import { RoleResponseDto } from '../dto/role-response.dto.js';
import { CreateRoleUseCase } from '../use-cases/create-role.use-case.js';
import { GetRolesUseCase } from '../use-cases/get-roles.use-case.js';
import { GetRoleByIdUseCase } from '../use-cases/get-role-by-id.use-case.js';
import { UpdateRoleUseCase } from '../use-cases/update-role.use-case.js';
import { DeleteRoleUseCase } from '../use-cases/delete-role.use-case.js';
import { AssignRoleToUserUseCase } from '../use-cases/assign-role-to-user.use-case.js';
import { RemoveRoleFromUserUseCase } from '../use-cases/remove-role-from-user.use-case.js';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
    private readonly removeRoleFromUserUseCase: RemoveRoleFromUserUseCase,
  ) {}

  @Get()
  @RequirePermissions('roles.read')
  @ApiOperation({ summary: 'List all roles for the active organization' })
  @ApiResponse({ status: 200, type: [RoleResponseDto] })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.getRolesUseCase.execute(user.organizationId);
  }

  @Get(':id')
  @RequirePermissions('roles.read')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.getRoleByIdUseCase.execute(id, user.organizationId);
  }

  @Post()
  @RequirePermissions('roles.create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, type: RoleResponseDto })
  @ApiResponse({ status: 409, description: 'Role code already exists' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRoleDto,
  ) {
    return this.createRoleUseCase.execute(user.organizationId, dto);
  }

  @Patch(':id')
  @RequirePermissions('roles.update')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Role UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 403, description: 'System roles cannot be edited' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.updateRoleUseCase.execute(id, user.organizationId, dto);
  }

  @Delete(':id')
  @RequirePermissions('roles.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role UUID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  @ApiResponse({ status: 403, description: 'System roles cannot be deleted' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.deleteRoleUseCase.execute(id, user.organizationId);
  }

  @Post(':id/assign')
  @RequirePermissions('roles.assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiParam({ name: 'id', description: 'Role UUID', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'Role or user not found' })
  @ApiResponse({ status: 409, description: 'User already has this role' })
  async assign(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRoleDto,
  ) {
    await this.assignRoleToUserUseCase.execute(
      id,
      dto.userId,
      user.organizationId,
    );
  }

  @Delete(':id/users/:userId')
  @RequirePermissions('roles.assign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiParam({ name: 'id', description: 'Role UUID', format: 'uuid' })
  @ApiParam({ name: 'userId', description: 'User UUID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Role removed successfully' })
  @ApiResponse({
    status: 404,
    description: 'Role, user, or assignment not found',
  })
  async unassign(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.removeRoleFromUserUseCase.execute(
      id,
      userId,
      user.organizationId,
    );
  }
}
