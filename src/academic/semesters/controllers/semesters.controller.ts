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

import { CreateSemesterDto } from '../dto/create-semester.dto.js';
import { GenerateRecommendationDto } from '../dto/generate-recommendation.dto.js';
import { PromotionDto } from '../dto/promotion.dto.js';
import { RolloverSemesterDto } from '../dto/rollover-semester.dto.js';
import { SemesterQueryDto } from '../dto/semester-query.dto.js';
import {
  SemesterListResponseDto,
  SemesterResponseDto,
} from '../dto/semester-response.dto.js';
import { UpdateSemesterDto } from '../dto/update-semester.dto.js';
import { ActivateSemesterUseCase } from '../use-cases/activate-semester.use-case.js';
import { CreateSemesterUseCase } from '../use-cases/create-semester.use-case.js';
import { DeactivateSemesterUseCase } from '../use-cases/deactivate-semester.use-case.js';
import { DeleteSemesterUseCase } from '../use-cases/delete-semester.use-case.js';
import { GeneratePromotionRecommendationUseCase } from '../use-cases/generate-promotion-recommendation.use-case.js';
import { GetSemesterByIdUseCase } from '../use-cases/get-semester-by-id.use-case.js';
import { GetSemestersUseCase } from '../use-cases/get-semesters.use-case.js';
import { PreviewPromotionUseCase } from '../use-cases/preview-promotion.use-case.js';
import { PromoteStudentsUseCase } from '../use-cases/promote-students.use-case.js';
import { RolloverSemesterUseCase } from '../use-cases/rollover-semester.use-case.js';
import { UpdateSemesterUseCase } from '../use-cases/update-semester.use-case.js';

@ApiTags('Semesters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('semesters')
export class SemestersController {
  constructor(
    private readonly getSemestersService: GetSemestersUseCase,
    private readonly getSemesterByIdService: GetSemesterByIdUseCase,
    private readonly createSemesterService: CreateSemesterUseCase,
    private readonly updateSemesterService: UpdateSemesterUseCase,
    private readonly deleteSemesterService: DeleteSemesterUseCase,
    private readonly rolloverSemesterService: RolloverSemesterUseCase,
    private readonly promoteStudentsService: PromoteStudentsUseCase,
    private readonly previewPromotionService: PreviewPromotionUseCase,
    private readonly generateRecommendationService: GeneratePromotionRecommendationUseCase,
    private readonly activateSemesterService: ActivateSemesterUseCase,
    private readonly deactivateSemesterService: DeactivateSemesterUseCase,
  ) {}

  @Get()
  @RequirePermissions('semesters.read')
  @ApiOperation({ summary: 'List all semesters (paginated, filterable)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of semesters',
    type: SemesterListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: SemesterQueryDto) {
    return this.getSemestersService.execute(query);
  }

  @Post('rollover')
  @RequirePermissions('semesters.create')
  @ApiOperation({
    summary:
      'Rollover semester data (classrooms, enrollments, etc.) from source to target semester',
  })
  @ApiResponse({
    status: 200,
    description: 'Rollover summary with created/skipped counts',
  })
  @ApiResponse({ status: 400, description: 'Source and target must differ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async rollover(@Body() dto: RolloverSemesterDto) {
    return this.rolloverSemesterService.execute(dto);
  }

  @Post('promote/recommend')
  @RequirePermissions('semesters.create')
  @ApiOperation({
    summary:
      'Generate per-student promotion recommendations based on class level',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students with recommended promotion actions',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async recommend(@Body() dto: GenerateRecommendationDto) {
    return this.generateRecommendationService.execute(dto);
  }

  @Post('promote/preview')
  @RequirePermissions('semesters.create')
  @ApiOperation({
    summary: 'Preview promotion summary counts from per-student decisions',
  })
  @ApiResponse({
    status: 200,
    description: 'Promotion preview with student counts per action',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async previewPromotion(@Body() dto: PromotionDto) {
    return this.previewPromotionService.execute(dto);
  }

  @Post('promote')
  @RequirePermissions('semesters.create')
  @ApiOperation({
    summary:
      'Execute batch student promotion across academic years (PROMOTE/REPEAT/GRADUATE)',
  })
  @ApiResponse({
    status: 200,
    description: 'Promotion result with counts',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester or class not found' })
  async promote(@Body() dto: PromotionDto) {
    return this.promoteStudentsService.execute(dto);
  }

  @Get(':id')
  @RequirePermissions('semesters.read')
  @ApiOperation({ summary: 'Get a semester by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Semester details',
    type: SemesterResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getSemesterByIdService.execute(id);
  }

  @Patch(':id/activate')
  @RequirePermissions('semesters.update')
  @ApiOperation({ summary: 'Activate a semester (deactivates all others)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Semester activated',
    type: SemesterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Academic year not active' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.activateSemesterService.execute(id);
  }

  @Patch(':id/deactivate')
  @RequirePermissions('semesters.update')
  @ApiOperation({ summary: 'Deactivate a semester' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Semester deactivated',
    type: SemesterResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.deactivateSemesterService.execute(id);
  }

  @Post()
  @RequirePermissions('semesters.create')
  @ApiOperation({ summary: 'Create a new semester' })
  @ApiResponse({
    status: 201,
    description: 'Semester created',
    type: SemesterResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Academic year not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Semester type already exists for this academic year',
  })
  async create(@Body() dto: CreateSemesterDto) {
    return this.createSemesterService.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions('semesters.update')
  @ApiOperation({ summary: 'Update a semester' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Semester updated',
    type: SemesterResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSemesterDto,
  ) {
    return this.updateSemesterService.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('semesters.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a semester' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Semester deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteSemesterService.execute(id);
  }
}
