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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import { RequirePermissions } from '../../access-control/permissions/decorators/require-permissions.decorator.js';

import { TenantResponseDto } from '../dto/tenant-response.dto.js';
import { CreateTenantDto } from '../dto/create-tenant.dto.js';
import { UpdateTenantDto } from '../dto/update-tenant.dto.js';

import { CreateTenantUseCase } from '../use-cases/create-tenant.use-case.js';
import { GetTenantsUseCase } from '../use-cases/get-tenants.use-case.js';
import { GetTenantByIdUseCase } from '../use-cases/get-tenant-by-id.use-case.js';
import { UpdateTenantUseCase } from '../use-cases/update-tenant.use-case.js';
import { DeleteTenantUseCase } from '../use-cases/delete-tenant.use-case.js';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly createUseCase: CreateTenantUseCase,
    private readonly getManyUseCase: GetTenantsUseCase,
    private readonly getByIdUseCase: GetTenantByIdUseCase,
    private readonly updateUseCase: UpdateTenantUseCase,
    private readonly deleteUseCase: DeleteTenantUseCase,
  ) {}

  @Post()
  @RequirePermissions('tenants.create')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, type: TenantResponseDto })
  async create(@Body() dto: CreateTenantDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @RequirePermissions('tenants.read')
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({ status: 200, type: [TenantResponseDto] })
  async findAll() {
    return this.getManyUseCase.execute();
  }

  @Get(':id')
  @RequirePermissions('tenants.read')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, type: TenantResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getByIdUseCase.execute(id);
  }

  @Patch(':id')
  @RequirePermissions('tenants.update')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, type: TenantResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('tenants.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ status: 204, description: 'Tenant deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUseCase.execute(id);
  }
}
