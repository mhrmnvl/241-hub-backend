import { Injectable } from '@nestjs/common';
import { FilesRepository } from '../repositories/files.repository.js';
import { CreateFileDto } from '../dto/create-file.dto.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadFileUseCase {
  constructor(private readonly repo: FilesRepository) {}

  async execute(
    organizationId: string,
    file: Express.Multer.File,
    schoolUnitId?: string,
    categoryId?: string,
    uploadedBy?: string,
  ) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname);
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Save the file physically to the uploads directory
    fs.writeFileSync(filePath, file.buffer);

    const dto: CreateFileDto = {
      organizationId,
      schoolUnitId,
      categoryId,
      filename: uniqueFilename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: `uploads/${uniqueFilename}`,
    };

    return this.repo.create(dto, uploadedBy);
  }
}
