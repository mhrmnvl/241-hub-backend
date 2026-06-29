import { RequirePermissions } from '../../../platform/access-control/permissions/decorators/require-permissions.decorator.js';
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
import { CurrentUser } from '../../../core/decorators/current-user.decorator.js';

import { TimeSlotResponseDto } from '../dto/time-slot-response.dto.js';
import { CreateTimeSlotDto } from '../dto/create-time-slot.dto.js';
import { UpdateTimeSlotDto } from '../dto/update-time-slot.dto.js';
import { CreateTimeSlotUseCase } from '../use-cases/create-time-slot.use-case.js';
import { DeleteTimeSlotUseCase } from '../use-cases/delete-time-slot.use-case.js';
import { GetTimeSlotByIdUseCase } from '../use-cases/get-time-slot-by-id.use-case.js';
import { GetTimeSlotsUseCase } from '../use-cases/get-time-slots.use-case.js';
import { UpdateTimeSlotUseCase } from '../use-cases/update-time-slot.use-case.js';

@ApiTags('Time-Slots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('time-slots')
export class TimeSlotsController {
  constructor(
    private readonly getTimeSlotsService: GetTimeSlotsUseCase,
    private readonly getTimeSlotByIdService: GetTimeSlotByIdUseCase,
    private readonly createTimeSlotService: CreateTimeSlotUseCase,
    private readonly updateTimeSlotService: UpdateTimeSlotUseCase,
    private readonly deleteTimeSlotService: DeleteTimeSlotUseCase,
  ) {}

  @Get()
  @RequirePermissions('time-slots.read')
  @ApiOperation({ summary: 'List all time slots (ordered by slot order)' })
  @ApiResponse({ status: 200, type: [TimeSlotResponseDto] })
  async findAll(@CurrentUser() user: { schoolUnitId: string }) {
    return this.getTimeSlotsService.execute(user.schoolUnitId);
  }

  @Get(':id')
  @RequirePermissions('time-slots.read')
  @ApiOperation({ summary: 'Get a time slot by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TimeSlotResponseDto })
  @ApiResponse({ status: 404, description: 'TimeSlot not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { schoolUnitId: string },
  ) {
    return this.getTimeSlotByIdService.execute(id, user.schoolUnitId);
  }

  @Post()
  @RequirePermissions('time-slots.create')
  @ApiOperation({ summary: 'Create a new time slot' })
  @ApiResponse({ status: 201, type: TimeSlotResponseDto })
  async create(
    @Body() dto: CreateTimeSlotDto,
    @CurrentUser() user: { schoolUnitId: string },
  ) {
    return this.createTimeSlotService.execute(dto, user.schoolUnitId);
  }

  @Patch(':id')
  @RequirePermissions('time-slots.update')
  @ApiOperation({ summary: 'Update a time slot' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TimeSlotResponseDto })
  @ApiResponse({ status: 404, description: 'TimeSlot not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTimeSlotDto,
    @CurrentUser() user: { schoolUnitId: string },
  ) {
    return this.updateTimeSlotService.execute(id, dto, user.schoolUnitId);
  }

  @Delete(':id')
  @RequirePermissions('time-slots.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a time slot (only if not in use by lessons)',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'TimeSlot deleted' })
  @ApiResponse({ status: 404, description: 'TimeSlot not found' })
  @ApiResponse({ status: 409, description: 'TimeSlot still in use' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { schoolUnitId: string },
  ) {
    await this.deleteTimeSlotService.execute(id, user.schoolUnitId);
  }
}
