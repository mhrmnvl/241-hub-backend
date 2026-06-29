import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CurriculumSubjectQueryDto } from '../dto/curriculum-subject-query.dto.js';

const INCLUDE = {
  curricula: { include: { academicYear: true } },
  subject: true,
  grade: true,
} satisfies Prisma.CurriculumSubjectInclude;

@Injectable()
export class CurriculumSubjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CurriculumSubjectQueryDto) {
    const { page = 1, limit = 10, curriculumId, gradeId, subjectId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CurriculumSubjectWhereInput = {
      deletedAt: null,
      ...(curriculumId && { curriculumId }),
      ...(gradeId && { gradeId }),
      ...(subjectId && { subjectId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.curriculumSubject.findMany({
        where,
        include: INCLUDE,
        skip,
        take: limit,
        orderBy: [{ grade: { level: 'asc' } }, { subject: { name: 'asc' } }],
      }),
      this.prisma.curriculumSubject.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.curriculumSubject.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE,
    });
  }

  async findDuplicate(
    curriculumId: string,
    gradeId: string,
    subjectId: string,
    excludeId?: string,
  ) {
    return this.prisma.curriculumSubject.findFirst({
      where: {
        curriculumId,
        gradeId,
        subjectId,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(data: {
    curriculumId: string;
    gradeId: string;
    subjectId: string;
    hoursPerWeek?: number;
  }) {
    return this.prisma.curriculumSubject.create({ data, include: INCLUDE });
  }

  async update(id: string, data: Prisma.CurriculumSubjectUpdateInput) {
    return this.prisma.curriculumSubject.update({
      where: { id },
      data,
      include: INCLUDE,
    });
  }

  async findSoftDeleted(
    curriculumId: string,
    gradeId: string,
    subjectId: string,
  ) {
    return this.prisma.curriculumSubject.findFirst({
      where: {
        curriculumId,
        gradeId,
        subjectId,
        deletedAt: { not: null },
      },
    });
  }

  async restore(id: string, data: { hoursPerWeek?: number }) {
    return this.prisma.curriculumSubject.update({
      where: { id },
      data: { ...data, deletedAt: null },
      include: INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.curriculumSubject.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
