import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { ClassroomQueryDto } from '../dto/classroom-query.dto.js';
import { resolveAcademicYearId } from '../../../shared/utils/active-academic-year.helper.js';

const CLASS_INCLUDE = {
  curricula: { include: { academicYear: true } },
  academicYear: true,
  grade: true,
} satisfies Prisma.ClassroomInclude;

@Injectable()
export class ClassroomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ClassroomQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const { curriculumId, academicYearId, gradeId, search, isActive } = query;
    const skip = (page - 1) * limit;

    const resolvedAcademicYearId = await resolveAcademicYearId(
      this.prisma,
      academicYearId,
    );

    const where: Prisma.ClassroomWhereInput = {
      deletedAt: null,
      ...(curriculumId && { curriculumId }),
      ...(resolvedAcademicYearId && { academicYearId: resolvedAcademicYearId }),
      ...(gradeId && { gradeId }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
      curricula: { deletedAt: null },
      academicYear: { deletedAt: null },
    };

    const [data, total] = await Promise.all([
      this.prisma.classroom.findMany({
        where,
        include: CLASS_INCLUDE,
        skip,
        take: limit,
        orderBy: [{ grade: { level: 'asc' } }, { code: 'asc' }],
      }),
      this.prisma.classroom.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.classroom.findFirst({
      where: { id, deletedAt: null },
      include: CLASS_INCLUDE,
    });
  }

  async findDuplicate(
    academicYearId: string,
    gradeId: string,
    code: string,
    excludeId?: string,
  ) {
    return this.prisma.classroom.findFirst({
      where: {
        academicYearId,
        gradeId,
        code,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(data: {
    curriculumId: string;
    academicYearId: string;
    gradeId: string;
    code: string;
    name: string | null;
    capacity: number;
    isActive?: boolean;
  }) {
    return this.prisma.classroom.create({ data, include: CLASS_INCLUDE });
  }

  async update(id: string, data: Prisma.ClassroomUpdateInput) {
    return this.prisma.classroom.update({
      where: { id },
      data,
      include: CLASS_INCLUDE,
    });
  }

  async findByCode(code: string) {
    return this.prisma.classroom.findFirst({
      where: {
        code: { equals: code, mode: 'insensitive' },
        deletedAt: null,
        isActive: true,
      },
      include: CLASS_INCLUDE,
    });
  }

  async findByAcademicYear(academicYearId: string) {
    return this.prisma.classroom.findMany({
      where: { academicYearId, deletedAt: null },
      include: CLASS_INCLUDE,
      orderBy: [{ grade: { level: 'asc' } }, { code: 'asc' }],
    });
  }

  async softDelete(id: string) {
    return this.prisma.classroom.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
