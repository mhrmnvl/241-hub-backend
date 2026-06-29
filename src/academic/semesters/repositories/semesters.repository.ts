import { Injectable } from '@nestjs/common';
import { Prisma, SemesterType } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { SemesterQueryDto } from '../dto/semester-query.dto.js';
import { resolveAcademicYearId } from '../../../shared/utils/active-academic-year.helper.js';

@Injectable()
export class SemestersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SemesterQueryDto) {
    const { page = 1, limit = 10, search, academicYearId, isActive } = query;
    const skip = (page - 1) * limit;

    const resolvedAcademicYearId = await resolveAcademicYearId(
      this.prisma,
      academicYearId,
    );

    const where: Prisma.SemesterWhereInput = {
      deletedAt: null,
      ...(resolvedAcademicYearId && { academicYearId: resolvedAcademicYearId }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        academicYear: { name: { contains: search, mode: 'insensitive' } },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.semester.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ academicYear: { name: 'desc' } }, { type: 'asc' }],
        include: { academicYear: { select: { id: true, name: true } } },
      }),
      this.prisma.semester.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.semester.findFirst({
      where: { id, deletedAt: null },
      include: { academicYear: { select: { id: true, name: true } } },
    });
  }

  async findActive() {
    return this.prisma.semester.findFirst({
      where: { isActive: true, deletedAt: null },
      include: { academicYear: { select: { id: true, name: true } } },
    });
  }

  async findByAcademicYearAndType(academicYearId: string, type: SemesterType) {
    return this.prisma.semester.findFirst({
      where: { academicYearId, type, deletedAt: null },
    });
  }

  async create(data: {
    academicYearId: string;
    type: SemesterType;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.semester.create({
      data,
      include: { academicYear: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, data: Prisma.SemesterUpdateInput) {
    return this.prisma.semester.update({
      where: { id },
      data,
      include: { academicYear: { select: { id: true, name: true } } },
    });
  }

  async deactivateAll() {
    return this.prisma.semester.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  async activateById(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.semester.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
      return tx.semester.update({
        where: { id },
        data: { isActive: true },
        include: { academicYear: { select: { id: true, name: true } } },
      });
    });
  }

  async hasRelatedData(id: string): Promise<boolean> {
    const count = await this.prisma.studentEnrollment.count({
      where: { semesterId: id, deletedAt: null },
      take: 1,
    });
    return count > 0;
  }

  async softDelete(id: string) {
    return this.prisma.semester.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
