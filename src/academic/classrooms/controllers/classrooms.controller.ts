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

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';

import { ClassroomQueryDto } from '../dto/classroom-query.dto.js';
import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
} from '../dto/classroom-response.dto.js';
import { CreateClassroomDto } from '../dto/create-classroom.dto.js';
import { UpdateClassroomDto } from '../dto/update-classroom.dto.js';
import { CreateClassroomUseCase } from '../use-cases/create-classroom.use-case.js';
import { DeleteClassroomUseCase } from '../use-cases/delete-classroom.use-case.js';
import { GetClassroomByIdUseCase } from '../use-cases/get-classroom-by-id.use-case.js';
import { GetClassroomsUseCase } from '../use-cases/get-classrooms.use-case.js';
import { UpdateClassroomUseCase } from '../use-cases/update-classroom.use-case.js';

@ApiTags('Classrooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classrooms')
export class ClassroomsController {
  constructor(
    private readonly GetClassroomsUseCase: GetClassroomsUseCase,
    private readonly GetClassroomByIdUseCase: GetClassroomByIdUseCase,
    private readonly CreateClassroomUseCase: CreateClassroomUseCase,
    private readonly UpdateClassroomUseCase: UpdateClassroomUseCase,
    private readonly DeleteClassroomUseCase: DeleteClassroomUseCase,
  ) {}

  @Get()
  @RequirePermissions('classrooms.read')
  @ApiOperation({ summary: 'List all classes (paginated, filterable)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of classes',
    type: ClassroomListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: ClassroomQueryDto) {
    return this.GetClassroomsUseCase.execute(query);
  }

  @Get(':id')
  @RequirePermissions('classrooms.read')
  @ApiOperation({ summary: 'Get a classroom by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Class details',
    type: ClassroomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.GetClassroomByIdUseCase.execute(id);
  }

  @Post()
  @RequirePermissions('classrooms.create')
  @ApiOperation({ summary: 'Create a classroom' })
  @ApiResponse({
    status: 201,
    description: 'Class created',
    type: ClassroomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  @ApiResponse({
    status: 409,
    description: 'Duplicate class name for this grade',
  })
  async create(@Body() dto: CreateClassroomDto) {
    return this.CreateClassroomUseCase.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions('classrooms.update')
  @ApiOperation({ summary: 'Update a classroom' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Class updated',
    type: ClassroomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Class or grade not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate class name for this grade',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassroomDto,
  ) {
    return this.UpdateClassroomUseCase.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('classrooms.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a classroom' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Class deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.DeleteClassroomUseCase.execute(id);
  }
}
