import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../core/decorators/current-user.decorator.js';
import { RequirePermissions } from '../../access-control/permissions/decorators/require-permissions.decorator.js';
import type { AuthenticatedUser } from '../../../core/types/authenticated-user.type.js';

import { FileResponseDto } from '../dto/file-response.dto.js';
import { UploadFileUseCase } from '../use-cases/upload-file.use-case.js';
import { GetFilesUseCase } from '../use-cases/get-files.use-case.js';
import { DeleteFileUseCase } from '../use-cases/delete-file.use-case.js';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadUseCase: UploadFileUseCase,
    private readonly getManyUseCase: GetFilesUseCase,
    private readonly deleteUseCase: DeleteFileUseCase,
  ) {}

  @Post('upload')
  @RequirePermissions('files.create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        schoolUnitId: {
          type: 'string',
          format: 'uuid',
        },
        categoryId: {
          type: 'string',
          format: 'uuid',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: FileResponseDto })
  async upload(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
    @Query('schoolUnitId') schoolUnitId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.uploadUseCase.execute(
      user.organizationId,
      file,
      schoolUnitId,
      categoryId,
      user.id,
    );
  }

  @Get()
  @RequirePermissions('files.read')
  @ApiOperation({ summary: 'Get all files' })
  @ApiQuery({ name: 'schoolUnitId', required: false, format: 'uuid' })
  @ApiResponse({ status: 200, type: [FileResponseDto] })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('schoolUnitId') schoolUnitId?: string,
  ) {
    return this.getManyUseCase.execute(user.organizationId, schoolUnitId);
  }

  @Delete(':id')
  @RequirePermissions('files.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 204, description: 'File deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUseCase.execute(id);
  }
}
