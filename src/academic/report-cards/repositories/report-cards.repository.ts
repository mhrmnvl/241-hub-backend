import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { ReportCardQueryDto } from '../dto/report-card-query.dto.js';
import { resolveSemesterId } from '../../../shared/utils/active-academic-year.helper.js';

const RAPOR_INCLUDE = {
  enrollment: {
    include: {
      student: {
        include: {
          user: { include: { profile: { select: { name: true } } } },
        },
      },
      classroom: {
        select: {
          id: true,
          code: true,
          name: true,
          grade: { select: { name: true } },
        },
      },
      semester: {
        select: {
          id: true,
          type: true,
          academicYear: { select: { id: true, name: true } },
        },
      },
    },
  },
} satisfies Prisma.ReportCardInclude;

@Injectable()
export class ReportCardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ReportCardQueryDto) {
    const {
      page = 1,
      limit = 10,
      studentId,
      classroomId,
      semesterId,
      isPublished,
    } = query;
    const skip = (page - 1) * limit;

    const resolvedSemesterId = await resolveSemesterId(this.prisma, semesterId);

    const where: Prisma.ReportCardWhereInput = {
      deletedAt: null,
      ...(isPublished !== undefined && { isPublished }),
      ...(studentId && { enrollment: { studentId } }),
      ...(classroomId && { enrollment: { classroomId } }),
      ...(resolvedSemesterId && {
        enrollment: { semesterId: resolvedSemesterId },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.reportCard.findMany({
        where,
        include: RAPOR_INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reportCard.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.reportCard.findUnique({
      where: { id },
      include: RAPOR_INCLUDE,
    });
  }

  async findByEnrollmentId(enrollmentId: string) {
    return this.prisma.reportCard.findUnique({
      where: { enrollmentId },
      include: RAPOR_INCLUDE,
    });
  }

  async upsert(data: {
    enrollmentId: string;
    totalAverage: number | null;
    rank?: number | null;
    teacherNote?: string | null;
    isPublished?: boolean;
  }) {
    const { enrollmentId, ...fields } = data;

    return this.prisma.reportCard.upsert({
      where: { enrollmentId },
      create: { enrollmentId, ...fields },
      update: { ...fields },
      include: RAPOR_INCLUDE,
    });
  }

  async update(
    id: string,
    data: {
      teacherNote?: string | null;
      rank?: number | null;
      isPublished?: boolean;
    },
  ) {
    return this.prisma.reportCard.update({
      where: { id },
      data,
      include: RAPOR_INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.reportCard.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
