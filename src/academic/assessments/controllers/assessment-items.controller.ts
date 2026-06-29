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
  CreateAssessmentItemDto,
  UpdateAssessmentItemDto,
  AssessmentItemQueryDto,
} from '../dto/assessment-item.dto.js';
import {
  GetAssessmentItemsUseCase,
  GetAssessmentItemByIdUseCase,
  CreateAssessmentItemUseCase,
  UpdateAssessmentItemUseCase,
  DeleteAssessmentItemUseCase,
} from '../use-cases/assessment-item.use-case.js';

@ApiTags('Assessment Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assessment-items')
export class AssessmentItemsController {
  constructor(
    private readonly getAll: GetAssessmentItemsUseCase,
    private readonly getById: GetAssessmentItemByIdUseCase,
    private readonly createUC: CreateAssessmentItemUseCase,
    private readonly updateUC: UpdateAssessmentItemUseCase,
    private readonly deleteUC: DeleteAssessmentItemUseCase,
  ) {}

  @Get()
  @RequirePermissions('assessment-items.read')
  @ApiOperation({ summary: 'List assessment items' })
  async findAll(@Query() q: AssessmentItemQueryDto) {
    return this.getAll.execute(q);
  }

  @Get(':id')
  @RequirePermissions('assessment-items.read')
  @ApiOperation({ summary: 'Get assessment item by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getById.execute(id);
  }

  @Post()
  @RequirePermissions('assessment-items.create')
  @ApiOperation({ summary: 'Create assessment item' })
  async create(@Body() dto: CreateAssessmentItemDto) {
    return this.createUC.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions('assessment-items.update')
  @ApiOperation({ summary: 'Update assessment item' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssessmentItemDto,
  ) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('assessment-items.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete assessment item' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUC.execute(id);
  }
}
