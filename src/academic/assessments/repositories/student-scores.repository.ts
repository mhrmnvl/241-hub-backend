import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { StudentScoreQueryDto } from '../dto/student-score.dto.js';

@Injectable()
export class StudentScoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: StudentScoreQueryDto) {
    const { page = 1, limit = 10, enrollmentId, assessmentItemId } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.StudentScoreWhereInput = {
      deletedAt: null,
      ...(enrollmentId && { enrollmentId }),
      ...(assessmentItemId && { assessmentItemId }),
    };
    const [data, total] = await Promise.all([
      this.prisma.studentScore.findMany({
        where,
        skip,
        take: limit,
        include: {
          enrollment: {
            include: {
              student: { include: { user: { select: { profile: true } } } },
            },
          },
          assessmentItem: true,
        },
      }),
      this.prisma.studentScore.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.studentScore.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findDuplicate(
    enrollmentId: string,
    assessmentItemId: string,
    excludeId?: string,
  ) {
    return this.prisma.studentScore.findFirst({
      where: {
        enrollmentId,
        assessmentItemId,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(data: {
    enrollmentId: string;
    assessmentItemId: string;
    score?: number;
    note?: string;
  }) {
    return this.prisma.studentScore.create({ data });
  }

  async update(id: string, data: Prisma.StudentScoreUpdateInput) {
    return this.prisma.studentScore.update({ where: { id }, data });
  }

  async findSoftDeleted(enrollmentId: string, assessmentItemId: string) {
    return this.prisma.studentScore.findFirst({
      where: {
        enrollmentId,
        assessmentItemId,
        deletedAt: { not: null },
      },
    });
  }

  async restore(id: string, data: { score?: number; note?: string }) {
    return this.prisma.studentScore.update({
      where: { id },
      data: { ...data, deletedAt: null },
    });
  }

  async softDelete(id: string) {
    return this.prisma.studentScore.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
