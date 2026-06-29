import { RequirePermissions } from '../../../platform/access-control/permissions/decorators/require-permissions.decorator.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../core/decorators/current-user.decorator.js';

import { UpdateProfileDto } from '../../../platform/profiles/index.js';
import { BulkImportTeachersResponseDto } from '../dto/response/bulk-import-teachers.response.dto.js';
import { CreateTeacherDto } from '../dto/request/create-teacher.request.dto.js';
import { TeacherQueryDto } from '../dto/request/teachers-query.request.dto.js';
import {
  TeacherListResponseDto,
  TeacherResponseDto,
} from '../dto/response/teachers.response.dto.js';
import { ExportTeacherQueryDto } from '../dto/request/export-teachers-query.request.dto.js';
import { UpdateTeacherDto } from '../dto/request/update-teacher.request.dto.js';
import { BulkImportTeachersUseCase } from '../use-cases/bulk-import-teachers.use-case.js';
import { CreateTeacherUseCase } from '../use-cases/create-teacher.use-case.js';
import { DeleteTeacherUseCase } from '../use-cases/delete-teacher.use-case.js';
import { ExportTeachersUseCase } from '../use-cases/export-teachers.use-case.js';
import { GetTeacherByIdUseCase } from '../use-cases/get-teacher-by-id.use-case.js';
import { GetTeachersUseCase } from '../use-cases/get-teachers.use-case.js';
import { ToggleTeacherActiveUseCase } from '../use-cases/toggle-teacher-active.use-case.js';
import { UpdateTeacherProfileUseCase } from '../use-cases/update-teacher-profile.use-case.js';
import { UpdateTeacherUseCase } from '../use-cases/update-teacher.use-case.js';

@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly getTeachersUseCase: GetTeachersUseCase,
    private readonly getTeacherByIdUseCase: GetTeacherByIdUseCase,
    private readonly createTeacherUseCase: CreateTeacherUseCase,
    private readonly updateTeacherUseCase: UpdateTeacherUseCase,
    private readonly deleteTeacherUseCase: DeleteTeacherUseCase,
    private readonly toggleTeacherActiveUseCase: ToggleTeacherActiveUseCase,
    private readonly updateProfileUseCase: UpdateTeacherProfileUseCase,
    private readonly bulkImportTeachersUseCase: BulkImportTeachersUseCase,
    private readonly exportTeachersUseCase: ExportTeachersUseCase,
  ) {}

  @Get()
  @RequirePermissions('teachers.read')
  @ApiOperation({ summary: 'List all teachers (paginated, searchable)' })
  @ApiResponse({ status: 200, type: TeacherListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: TeacherQueryDto) {
    return this.getTeachersUseCase.execute(query);
  }

  @Get('export')
  @RequirePermissions('teachers.read')
  @ApiOperation({ summary: 'Export teachers to Excel (.xlsx)' })
  @ApiResponse({
    status: 200,
    description: 'Returns an Excel file as attachment',
    headers: {
      'Content-Disposition': {
        description: 'attachment; filename="teachers.xlsx"',
        schema: { type: 'string' },
      },
    },
  })
  async export(@Query() query: ExportTeacherQueryDto): Promise<StreamableFile> {
    const buffer = await this.exportTeachersUseCase.execute(query);
    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename="teachers.xlsx"',
    });
  }

  @Get('import-template')
  @RequirePermissions('teachers.read')
  @ApiOperation({
    summary: 'Download blank import template (.xlsx) for teachers',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a blank Excel template file',
    headers: {
      'Content-Disposition': {
        description: 'attachment; filename="template_import_pegawai.xlsx"',
        schema: { type: 'string' },
      },
    },
  })
  async downloadImportTemplate(): Promise<StreamableFile> {
    const buffer = await this.exportTeachersUseCase.buildImportTemplate();
    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename="template_import_pegawai.xlsx"',
    });
  }

  @Get(':id')
  @RequirePermissions('teachers.read')
  @ApiOperation({ summary: 'Get an teacher by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TeacherResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getTeacherByIdUseCase.execute(id);
  }

  @Post()
  @RequirePermissions('teachers.create')
  @ApiOperation({
    summary: 'Create teacher (User + Profile in one transaction)',
  })
  @ApiResponse({ status: 201, type: TeacherResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'Duplicate identifier / NIK / NIP / NUPTK',
  })
  async create(
    @Body() dto: CreateTeacherDto,
    @CurrentUser()
    creator: { organizationId: string; schoolUnitId: string | null },
  ) {
    return this.createTeacherUseCase.execute(
      dto,
      creator.organizationId,
      creator.schoolUnitId,
    );
  }

  @Post('bulk-import')
  @RequirePermissions('teachers.create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Bulk import teachers from Excel file (.xlsx)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: BulkImportTeachersResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file or empty sheet' })
  async bulkImport(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
    @CurrentUser()
    creator: { organizationId: string; schoolUnitId: string | null },
  ) {
    return this.bulkImportTeachersUseCase.execute(
      file.buffer,
      creator.organizationId,
      creator.schoolUnitId,
    );
  }

  @Patch(':id')
  @RequirePermissions('teachers.update')
  @ApiOperation({
    summary: 'Update teacher fields (NIP, NUPTK, employment status)',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TeacherResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.updateTeacherUseCase.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('teachers.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete an teacher (also deactivates User)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Teacher deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteTeacherUseCase.execute(id);
  }

  @Patch(':id/profile')
  @RequirePermissions('teachers.update')
  @ApiOperation({ summary: "Update teacher's profile" })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TeacherResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 409, description: 'Duplicate NIK' })
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.updateProfileUseCase.execute(id, dto);
  }

  @Patch(':id/toggle-active')
  @RequirePermissions('teachers.update')
  @ApiOperation({
    summary: 'Activate or deactivate an teacher account (without deleting)',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Account status updated' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isActive', new ParseBoolPipe()) isActive: boolean,
  ) {
    return this.toggleTeacherActiveUseCase.execute(id, isActive);
  }
}
