import { RequirePermissions } from '../../access-control/permissions/decorators/require-permissions.decorator.js';
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

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import { ReqTenantContext } from '../../../core/decorators/tenant-context.decorator.js';
import type { TenantContext } from '../../../core/decorators/tenant-context.decorator.js';

import { SchoolUnitSocialMediaResponseDto } from '../dto/school-unit-social-media-response.dto.js';
import {
  CreateSchoolUnitSocialMediaDto,
  UpdateSchoolUnitSocialMediaDto,
} from '../dto/school-unit-social-media.dto.js';
import { SchoolUnitSocialMediaUseCase } from '../use-cases/school-unit-social-media.use-case.js';

@ApiTags('School Unit Social Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('school-unit-social-medias')
export class SchoolUnitSocialMediaController {
  constructor(private readonly useCase: SchoolUnitSocialMediaUseCase) {}

  @Get()
  @RequirePermissions('institutions.read')
  @ApiOperation({ summary: 'Get school unit social media links' })
  @ApiResponse({ status: 200, type: [SchoolUnitSocialMediaResponseDto] })
  async findAll(@ReqTenantContext() tenantContext: TenantContext) {
    return this.useCase.findAll(tenantContext.schoolUnitId);
  }

  @Post()
  @RequirePermissions('institutions.create')
  @ApiOperation({ summary: 'Add social media link to school unit' })
  @ApiResponse({ status: 201, type: SchoolUnitSocialMediaResponseDto })
  @ApiResponse({ status: 409, description: 'Platform already linked' })
  async create(
    @ReqTenantContext() tenantContext: TenantContext,
    @Body() dto: CreateSchoolUnitSocialMediaDto,
  ) {
    return this.useCase.create(tenantContext.schoolUnitId, dto);
  }

  @Patch(':id')
  @RequirePermissions('institutions.update')
  @ApiOperation({ summary: 'Update a social media link entry' })
  @ApiParam({ name: 'id', description: 'Social media link ID', format: 'uuid' })
  @ApiResponse({ status: 200, type: SchoolUnitSocialMediaResponseDto })
  @ApiResponse({ status: 404, description: 'Social media link not found' })
  async update(
    @ReqTenantContext() tenantContext: TenantContext,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSchoolUnitSocialMediaDto,
  ) {
    return this.useCase.update(tenantContext.schoolUnitId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('institutions.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a social media link' })
  @ApiParam({ name: 'id', description: 'Social media link ID', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Social media link removed' })
  async remove(
    @ReqTenantContext() tenantContext: TenantContext,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.useCase.remove(tenantContext.schoolUnitId, id);
  }
}
