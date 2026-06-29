import { Injectable } from '@nestjs/common';
import { EnrollmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { StudentEnrollmentQueryDto } from '../dto/student-enrollment-query.dto.js';
import { resolveSemesterId } from '../../../shared/utils/active-academic-year.helper.js';

const INCLUDE = {
  student: { include: { user: { select: { profile: true } } } },
  classroom: true,
  semester: { include: { academicYear: true } },
  reportCard: true,
} satisfies Prisma.StudentEnrollmentInclude;

@Injectable()
export class EnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: StudentEnrollmentQueryDto) {
    const {
      page = 1,
      limit = 10,
      studentId,
      classroomId,
      semesterId,
      academicYearId,
      status,
    } = query;
    const skip = (page - 1) * limit;

    let resolvedSemesterId = semesterId;
    const resolvedAcademicYearId = academicYearId;

    if (!resolvedSemesterId && !resolvedAcademicYearId) {
      resolvedSemesterId = await resolveSemesterId(this.prisma);
    }

    const where: Prisma.StudentEnrollmentWhereInput = {
      deletedAt: null,
      ...(studentId && { studentId }),
      ...(classroomId && { classroomId }),
      ...(resolvedSemesterId && { semesterId: resolvedSemesterId }),
      ...(status && { status }),
      ...(resolvedAcademicYearId && {
        semester: { academicYearId: resolvedAcademicYearId },
      }),
    };
    const [data, total] = await Promise.all([
      this.prisma.studentEnrollment.findMany({
        where,
        include: INCLUDE,
        skip,
        take: limit,
        orderBy: { enrolledAt: 'desc' },
      }),
      this.prisma.studentEnrollment.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.studentEnrollment.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE,
    });
  }

  async findActiveByStudentId(studentId: string) {
    return this.prisma.studentEnrollment.findFirst({
      where: {
        studentId,
        status: EnrollmentStatus.ACTIVE,
        deletedAt: null,
      },
      include: INCLUDE,
    });
  }

  async findActiveByClassroomAndSemester(
    classroomId: string,
    semesterId: string,
  ) {
    return this.prisma.studentEnrollment.findMany({
      where: {
        classroomId,
        semesterId,
        status: EnrollmentStatus.ACTIVE,
        deletedAt: null,
      },
      include: INCLUDE,
    });
  }

  async findDuplicate(
    studentId: string,
    semesterId: string,
    excludeId?: string,
  ) {
    return this.prisma.studentEnrollment.findFirst({
      where: {
        studentId,
        semesterId,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(data: {
    studentId: string;
    classroomId: string;
    semesterId: string;
    status?: EnrollmentStatus;
  }) {
    return this.prisma.studentEnrollment.create({ data, include: INCLUDE });
  }

  async update(
    id: string,
    data: Partial<{
      classroomId: string;
      semesterId: string;
      status: EnrollmentStatus;
      endedAt: Date;
      note: string;
    }>,
  ) {
    return this.prisma.studentEnrollment.update({
      where: { id },
      data,
      include: INCLUDE,
    });
  }

  async createMany(
    data: {
      studentId: string;
      classroomId: string;
      semesterId: string;
      status?: EnrollmentStatus;
    }[],
  ) {
    return this.prisma.$transaction(
      data.map((item) =>
        this.prisma.studentEnrollment.create({ data: item, include: INCLUDE }),
      ),
    );
  }

  async bulkCreateForRollover(
    data: {
      studentId: string;
      classroomId: string;
      semesterId: string;
    }[],
  ) {
    return this.prisma.studentEnrollment.createMany({
      data: data.map((item) => ({
        ...item,
        status: EnrollmentStatus.ACTIVE,
      })),
      skipDuplicates: true,
    });
  }

  async bulkUpdateStatus(
    ids: string[],
    status: EnrollmentStatus,
    endedAt?: Date,
  ) {
    return this.prisma.studentEnrollment.updateMany({
      where: { id: { in: ids } },
      data: { status, ...(endedAt && { endedAt }) },
    });
  }

  async findSoftDeleted(studentId: string, semesterId: string) {
    return this.prisma.studentEnrollment.findFirst({
      where: { studentId, semesterId, deletedAt: { not: null } },
    });
  }

  async restore(id: string, data: { classroomId: string }) {
    return this.prisma.studentEnrollment.update({
      where: { id },
      data: { ...data, deletedAt: null, status: EnrollmentStatus.ACTIVE },
      include: INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.studentEnrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
