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

import { GenerateReportCardDto } from '../dto/generate-report-card.dto.js';
import { ReportCardQueryDto } from '../dto/report-card-query.dto.js';
import { UpdateReportCardDto } from '../dto/update-report-card.dto.js';
import { DeleteReportCardUseCase } from '../use-cases/delete-report-card.use-case.js';
import { GenerateReportCardUseCase } from '../use-cases/generate-report-card.use-case.js';
import { GetReportCardByIdUseCase } from '../use-cases/get-report-card-by-id.use-case.js';
import { GetReportCardsUseCase } from '../use-cases/get-report-cards.use-case.js';
import { PublishReportCardUseCase } from '../use-cases/publish-report-card.use-case.js';
import { UpdateReportCardUseCase } from '../use-cases/update-report-card.use-case.js';

@ApiTags('ReportCards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reportCards')
export class ReportCardsController {
  constructor(
    private readonly getReportCardsService: GetReportCardsUseCase,
    private readonly getReportCardByIdService: GetReportCardByIdUseCase,
    private readonly generateReportCardService: GenerateReportCardUseCase,
    private readonly updateReportCardService: UpdateReportCardUseCase,
    private readonly publishReportCardService: PublishReportCardUseCase,
    private readonly deleteReportCardService: DeleteReportCardUseCase,
  ) {}

  @Get()
  @RequirePermissions('report-cards.read')
  @ApiOperation({ summary: 'List reportCards (paginated, filterable)' })
  findAll(@Query() query: ReportCardQueryDto) {
    return this.getReportCardsService.execute(query);
  }

  @Get(':id')
  @RequirePermissions('report-cards.read')
  @ApiOperation({ summary: 'Get reportCard by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getReportCardByIdService.execute(id);
  }

  @Post('generate')
  @RequirePermissions('report-cards.create')
  @ApiOperation({ summary: 'Generate reportCard for a student' })
  generate(@Body() dto: GenerateReportCardDto) {
    return this.generateReportCardService.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions('report-cards.update')
  @ApiOperation({ summary: 'Update reportCard details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReportCardDto,
  ) {
    return this.updateReportCardService.execute(id, dto);
  }

  @Patch(':id/publish')
  @RequirePermissions('report-cards.publish')
  @ApiOperation({ summary: 'Publish a reportCard' })
  @ApiParam({ name: 'id', format: 'uuid' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.publishReportCardService.execute(id);
  }

  @Delete(':id')
  @RequirePermissions('report-cards.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a reportCard' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteReportCardService.execute(id);
  }
}
