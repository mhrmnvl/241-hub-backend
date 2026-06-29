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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import {
  BatchUpsertScheduleDto,
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleQueryDto,
} from '../dto/schedule.dto.js';
import {
  GetSchedulesUseCase,
  GetScheduleByIdUseCase,
  GetSchedulesByClassroomUseCase,
  CreateScheduleUseCase,
  UpdateScheduleUseCase,
  DeleteScheduleUseCase,
  BatchUpsertScheduleUseCase,
} from '../use-cases/schedule.use-case.js';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly getAll: GetSchedulesUseCase,
    private readonly getById: GetScheduleByIdUseCase,
    private readonly getByClassroom: GetSchedulesByClassroomUseCase,
    private readonly createUC: CreateScheduleUseCase,
    private readonly updateUC: UpdateScheduleUseCase,
    private readonly deleteUC: DeleteScheduleUseCase,
    private readonly batchUpsertUC: BatchUpsertScheduleUseCase,
  ) {}

  @Get()
  @RequirePermissions('schedules.read')
  @ApiOperation({ summary: 'List schedules' })
  async findAll(@Query() q: ScheduleQueryDto) {
    return this.getAll.execute(q);
  }

  @Get('classroom/:classroomId')
  @RequirePermissions('schedules.read')
  @ApiOperation({ summary: 'Get all schedules for a classroom' })
  @ApiParam({ name: 'classroomId', format: 'uuid' })
  async findByClassroom(
    @Param('classroomId', ParseUUIDPipe) classroomId: string,
  ) {
    const data = await this.getByClassroom.execute(classroomId);
    return { data };
  }

  @Put('classroom/:classroomId/batch')
  @RequirePermissions('schedules.update')
  @ApiOperation({ summary: 'Batch upsert schedules for a classroom by day' })
  @ApiParam({ name: 'classroomId', format: 'uuid' })
  async batchUpsert(
    @Param('classroomId', ParseUUIDPipe) classroomId: string,
    @Body() dto: BatchUpsertScheduleDto,
  ) {
    return this.batchUpsertUC.execute(classroomId, dto);
  }

  @Get(':id')
  @RequirePermissions('schedules.read')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getById.execute(id);
  }

  @Post()
  @RequirePermissions('schedules.create')
  @ApiOperation({ summary: 'Create schedule' })
  async create(@Body() dto: CreateScheduleDto) {
    return this.createUC.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions('schedules.update')
  @ApiOperation({ summary: 'Update schedule' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('schedules.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUC.execute(id);
  }
}
