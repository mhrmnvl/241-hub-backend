import { RequirePermissions } from '../../access-control/permissions/decorators/require-permissions.decorator.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { CurrentUser } from '../../../core/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../../core/types/authenticated-user.type.js';

import {
  AddressResponseDto,
  CreateAddressDto,
  UpdateAddressDto,
} from '../../../shared/dto/address.dto.js';
import { SchoolUnitAddressUseCase } from '../use-cases/school-unit-address.use-case.js';

@ApiTags('School Unit Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('school-unit-addresses')
export class SchoolUnitAddressesController {
  constructor(private readonly useCase: SchoolUnitAddressUseCase) {}

  @Get()
  @RequirePermissions('institutions.read')
  @ApiOperation({ summary: 'Get school unit primary address' })
  @ApiResponse({ status: 200, type: AddressResponseDto })
  @ApiResponse({ status: 404, description: 'Address not set yet' })
  async getAddress(@CurrentUser() user: AuthenticatedUser) {
    return this.useCase.getAddress(user.schoolUnitId ?? '');
  }

  @Post()
  @RequirePermissions('institutions.create')
  @ApiOperation({ summary: 'Set school unit primary address (one-time)' })
  @ApiResponse({ status: 201, type: AddressResponseDto })
  @ApiResponse({ status: 409, description: 'Address already exists' })
  async setAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAddressDto,
  ) {
    return this.useCase.setAddress(user.schoolUnitId ?? '', dto);
  }

  @Patch()
  @RequirePermissions('institutions.update')
  @ApiOperation({ summary: 'Update school unit primary address' })
  @ApiResponse({ status: 200, type: AddressResponseDto })
  async updateAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.useCase.updateAddress(user.schoolUnitId ?? '', dto);
  }

  @Delete()
  @RequirePermissions('institutions.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove school unit primary address' })
  @ApiResponse({ status: 204, description: 'Address removed' })
  async removeAddress(@CurrentUser() user: AuthenticatedUser) {
    await this.useCase.removeAddress(user.schoolUnitId ?? '');
  }
}
