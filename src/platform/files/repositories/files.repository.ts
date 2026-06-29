import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateFileDto } from '../dto/create-file.dto.js';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(organizationId: string, schoolUnitId?: string) {
    return this.prisma.file.findMany({
      where: {
        organizationId,
        schoolUnitId: schoolUnitId || undefined,
        deletedAt: null,
      },
      include: { category: true, uploader: true },
    });
  }

  async findById(id: string) {
    return this.prisma.file.findUnique({
      where: { id, deletedAt: null },
      include: { category: true, uploader: true },
    });
  }

  async create(dto: CreateFileDto, uploadedBy?: string) {
    return this.prisma.file.create({
      data: {
        organizationId: dto.organizationId,
        schoolUnitId: dto.schoolUnitId || null,
        categoryId: dto.categoryId || null,
        filename: dto.filename,
        originalName: dto.originalName,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        storageKey: dto.storageKey,
        uploadedBy: uploadedBy || null,
      },
      include: { category: true },
    });
  }

  async softDelete(id: string) {
    return this.prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // File Categories
  async findCategories(organizationId: string) {
    return this.prisma.fileCategory.findMany({
      where: {
        OR: [
          { isSystem: true },
          { organizationId },
        ],
      },
    });
  }

  async createCategory(organizationId: string, code: string, name: string, description?: string) {
    return this.prisma.fileCategory.create({
      data: {
        organizationId,
        code,
        name,
        description,
        isSystem: false,
      },
    });
  }
}
