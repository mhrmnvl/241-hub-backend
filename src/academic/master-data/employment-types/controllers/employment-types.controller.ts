import { RequirePermissions } from '../../../../platform/access-control/permissions/decorators/require-permissions.decorator.js';
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
  Query,
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
import { ReqTenantContext } from '../../../../core/decorators/tenant-context.decorator.js';
import type { TenantContext } from '../../../../core/decorators/tenant-context.decorator.js';

import { EmploymentTypeQueryDto } from '../dto/employment-type-query.dto.js';
import {
  EmploymentTypeListResponseDto,
  EmploymentTypeResponseDto,
} from '../dto/employment-type-response.dto.js';
import {
  CreateEmploymentTypeDto,
  UpdateEmploymentTypeDto,
} from '../dto/create-employment-type.dto.js';

import { CreateEmploymentTypeUseCase } from '../use-cases/create-employment-type.use-case.js';
import { GetEmploymentTypesUseCase } from '../use-cases/get-employment-types.use-case.js';
import { GetEmploymentTypeByIdUseCase } from '../use-cases/get-employment-type-by-id.use-case.js';
import { UpdateEmploymentTypeUseCase } from '../use-cases/update-employment-type.use-case.js';
import { DeleteEmploymentTypeUseCase } from '../use-cases/delete-employment-type.use-case.js';

@ApiTags('Employment Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employment-types')
export class EmploymentTypesController {
  constructor(
    private readonly createUseCase: CreateEmploymentTypeUseCase,
    private readonly listUseCase: GetEmploymentTypesUseCase,
    private readonly getByIdUseCase: GetEmploymentTypeByIdUseCase,
    private readonly updateUseCase: UpdateEmploymentTypeUseCase,
    private readonly deleteUseCase: DeleteEmploymentTypeUseCase,
  ) {}

  @Get()
  @RequirePermissions('teachers.read')
  @ApiOperation({ summary: 'List all employment types for the school unit' })
  @ApiResponse({ status: 200, type: EmploymentTypeListResponseDto })
  async findAll(
    @ReqTenantContext() tenantContext: TenantContext,
    @Query() query: EmploymentTypeQueryDto,
  ) {
    return this.listUseCase.execute(tenantContext.schoolUnitId, query);
  }

  @Get(':id')
  @RequirePermissions('teachers.read')
  @ApiOperation({ summary: 'Get employment type by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: EmploymentTypeResponseDto })
  @ApiResponse({ status: 404, description: 'Employment type not found' })
  async findOne(
    @ReqTenantContext() tenantContext: TenantContext,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.getByIdUseCase.execute(tenantContext.schoolUnitId, id);
  }

  @Post()
  @RequirePermissions('teachers.create')
  @ApiOperation({ summary: 'Create a new employment type' })
  @ApiResponse({ status: 201, type: EmploymentTypeResponseDto })
  @ApiResponse({ status: 409, description: 'Duplicate code' })
  async create(
    @ReqTenantContext() tenantContext: TenantContext,
    @Body() dto: CreateEmploymentTypeDto,
  ) {
    return this.createUseCase.execute(tenantContext.schoolUnitId, dto);
  }

  @Patch(':id')
  @RequirePermissions('teachers.update')
  @ApiOperation({ summary: 'Update an employment type' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: EmploymentTypeResponseDto })
  @ApiResponse({ status: 404, description: 'Employment type not found' })
  async update(
    @ReqTenantContext() tenantContext: TenantContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmploymentTypeDto,
  ) {
    return this.updateUseCase.execute(tenantContext.schoolUnitId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('teachers.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an employment type' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 409, description: 'Still in use' })
  async remove(
    @ReqTenantContext() tenantContext: TenantContext,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.deleteUseCase.execute(tenantContext.schoolUnitId, id);
  }
}
