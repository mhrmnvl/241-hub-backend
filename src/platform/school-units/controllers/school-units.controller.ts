import { RequirePermissions } from '../../access-control/permissions/decorators/require-permissions.decorator.js';
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../core/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../../core/types/authenticated-user.type.js';

import { SchoolUnitResponseDto } from '../dto/school-unit-response.dto.js';
import { CreateSchoolUnitDto } from '../dto/create-school-unit.dto.js';
import { UpdateSchoolUnitDto } from '../dto/update-school-unit.dto.js';
import { GetSchoolUnitUseCase } from '../use-cases/get-school-unit.use-case.js';
import { SetupSchoolUnitUseCase } from '../use-cases/setup-school-unit.use-case.js';
import { UpdateSchoolUnitUseCase } from '../use-cases/update-school-unit.use-case.js';

@ApiTags('School Unit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('school-units')
export class SchoolUnitsController {
  constructor(
    private readonly getSchoolUnitUseCase: GetSchoolUnitUseCase,
    private readonly setupSchoolUnitUseCase: SetupSchoolUnitUseCase,
    private readonly updateSchoolUnitUseCase: UpdateSchoolUnitUseCase,
  ) {}

  @Get()
  @RequirePermissions('institutions.read')
  @ApiOperation({ summary: 'Get school unit profile' })
  @ApiResponse({ status: 200, type: SchoolUnitResponseDto })
  @ApiResponse({ status: 404, description: 'School unit not set up yet' })
  async findOne(@CurrentUser() user: AuthenticatedUser) {
    return this.getSchoolUnitUseCase.execute(user.schoolUnitId ?? '');
  }

  @Post()
  @RequirePermissions('institutions.create')
  @ApiOperation({ summary: 'Create school unit' })
  @ApiResponse({ status: 201, type: SchoolUnitResponseDto })
  @ApiResponse({ status: 409, description: 'School unit already exists' })
  async setup(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSchoolUnitDto,
  ) {
    return this.setupSchoolUnitUseCase.execute(user.organizationId, dto);
  }

  @Patch()
  @RequirePermissions('institutions.update')
  @ApiOperation({ summary: 'Update school unit profile' })
  @ApiResponse({ status: 200, type: SchoolUnitResponseDto })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSchoolUnitDto,
  ) {
    return this.updateSchoolUnitUseCase.execute(
      user.schoolUnitId ?? '',
      dto,
    );
  }
}
