import { Module } from '@nestjs/common';
import { FilesController } from './controllers/files.controller.js';
import { FilesRepository } from './repositories/files.repository.js';

// Use cases
import { UploadFileUseCase } from './use-cases/upload-file.use-case.js';
import { GetFilesUseCase } from './use-cases/get-files.use-case.js';
import { DeleteFileUseCase } from './use-cases/delete-file.use-case.js';

@Module({
  controllers: [FilesController],
  providers: [
    FilesRepository,
    UploadFileUseCase,
    GetFilesUseCase,
    DeleteFileUseCase,
  ],
  exports: [FilesRepository],
})
export class FilesModule {}
