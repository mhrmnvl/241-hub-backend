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

import { OrganizationResponseDto } from '../dto/organization-response.dto.js';
import { CreateOrganizationDto } from '../dto/create-organization.dto.js';
import { UpdateOrganizationDto } from '../dto/update-organization.dto.js';

import { CreateOrganizationUseCase } from '../use-cases/create-organization.use-case.js';
import { GetOrganizationsUseCase } from '../use-cases/get-organizations.use-case.js';
import { GetOrganizationByIdUseCase } from '../use-cases/get-organization-by-id.use-case.js';
import { UpdateOrganizationUseCase } from '../use-cases/update-organization.use-case.js';
import { DeleteOrganizationUseCase } from '../use-cases/delete-organization.use-case.js';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly createUseCase: CreateOrganizationUseCase,
    private readonly getManyUseCase: GetOrganizationsUseCase,
    private readonly getByIdUseCase: GetOrganizationByIdUseCase,
    private readonly updateUseCase: UpdateOrganizationUseCase,
    private readonly deleteUseCase: DeleteOrganizationUseCase,
  ) {}

  @Post()
  @RequirePermissions('organizations.create')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, type: OrganizationResponseDto })
  async create(@Body() dto: CreateOrganizationDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @RequirePermissions('organizations.read')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, type: [OrganizationResponseDto] })
  async findAll() {
    return this.getManyUseCase.execute();
  }

  @Get(':id')
  @RequirePermissions('organizations.read')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, type: OrganizationResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getByIdUseCase.execute(id);
  }

  @Patch(':id')
  @RequirePermissions('organizations.update')
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, type: OrganizationResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('organizations.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: 204, description: 'Organization deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUseCase.execute(id);
  }
}
