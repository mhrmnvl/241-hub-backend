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
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';

import {
  CreateStudentScoreDto,
  UpdateStudentScoreDto,
  StudentScoreQueryDto,
} from '../dto/student-score.dto.js';
import {
  GetStudentScoresUseCase,
  GetStudentScoreByIdUseCase,
  CreateStudentScoreUseCase,
  UpdateStudentScoreUseCase,
  DeleteStudentScoreUseCase,
} from '../use-cases/student-score.use-case.js';

@ApiTags('Student Scores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-scores')
export class StudentScoresController {
  constructor(
    private readonly getAll: GetStudentScoresUseCase,
    private readonly getById: GetStudentScoreByIdUseCase,
    private readonly createUC: CreateStudentScoreUseCase,
    private readonly updateUC: UpdateStudentScoreUseCase,
    private readonly deleteUC: DeleteStudentScoreUseCase,
  ) {}

  @Get()
  @RequirePermissions('student-scores.read')
  @ApiOperation({ summary: 'List student scores' })
  async findAll(@Query() q: StudentScoreQueryDto) {
    return this.getAll.execute(q);
  }

  @Get(':id')
  @RequirePermissions('student-scores.read')
  @ApiOperation({ summary: 'Get student score by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getById.execute(id);
  }

  @Post()
  @RequirePermissions('student-scores.create')
  @ApiOperation({ summary: 'Create student score' })
  async create(@Body() dto: CreateStudentScoreDto) {
    return this.createUC.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions('student-scores.update')
  @ApiOperation({ summary: 'Update student score' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentScoreDto,
  ) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('student-scores.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student score' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUC.execute(id);
  }
}
