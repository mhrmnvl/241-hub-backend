import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { TeachingAssignmentQueryDto } from '../dto/teaching-assignment-query.dto.js';
import { resolveSemesterId } from '../../../shared/utils/active-academic-year.helper.js';

const INCLUDE = {
  teacher: { include: { user: { select: { profile: true } } } },
  classroom: true,
  subject: true,
  semester: { include: { academicYear: true } },
} satisfies Prisma.TeachingAssignmentInclude;

@Injectable()
export class TeachingAssignmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TeachingAssignmentQueryDto) {
    const {
      page = 1,
      limit = 10,
      teacherId,
      classroomId,
      subjectId,
      semesterId,
    } = query;
    const skip = (page - 1) * limit;

    const resolvedSemesterId = await resolveSemesterId(this.prisma, semesterId);

    const where: Prisma.TeachingAssignmentWhereInput = {
      deletedAt: null,
      ...(teacherId && { teacherId }),
      ...(classroomId && { classroomId }),
      ...(subjectId && { subjectId }),
      ...(resolvedSemesterId && { semesterId: resolvedSemesterId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.teachingAssignment.findMany({
        where,
        include: INCLUDE,
        skip,
        take: limit,
        orderBy: { classroom: { name: 'asc' } },
      }),
      this.prisma.teachingAssignment.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.teachingAssignment.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE,
    });
  }

  async findDuplicate(
    teacherId: string,
    classroomId: string,
    subjectId: string,
    semesterId: string,
    excludeId?: string,
  ) {
    return this.prisma.teachingAssignment.findFirst({
      where: {
        teacherId,
        classroomId,
        subjectId,
        semesterId,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(data: {
    teacherId: string;
    classroomId: string;
    subjectId: string;
    semesterId: string;
  }) {
    return this.prisma.teachingAssignment.create({ data, include: INCLUDE });
  }

  async update(
    id: string,
    data: Partial<{
      teacherId: string;
      classroomId: string;
      subjectId: string;
      semesterId: string;
    }>,
  ) {
    return this.prisma.teachingAssignment.update({
      where: { id },
      data,
      include: INCLUDE,
    });
  }

  async findSoftDeleted(
    teacherId: string,
    classroomId: string,
    subjectId: string,
    semesterId: string,
  ) {
    return this.prisma.teachingAssignment.findFirst({
      where: {
        teacherId,
        classroomId,
        subjectId,
        semesterId,
        deletedAt: { not: null },
      },
    });
  }

  async restore(
    id: string,
    data: Partial<{
      teacherId: string;
      classroomId: string;
      subjectId: string;
      semesterId: string;
    }>,
  ) {
    return this.prisma.teachingAssignment.update({
      where: { id },
      data: { ...data, deletedAt: null },
      include: INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.teachingAssignment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findClassroomById(id: string) {
    return this.prisma.classroom.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, academicYearId: true },
    });
  }

  async findSemesterById(id: string) {
    return this.prisma.semester.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, academicYearId: true },
    });
  }
}
