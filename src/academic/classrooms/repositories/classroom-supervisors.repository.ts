import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { ClassroomSupervisorQueryDto } from '../dto/classroom-supervisor-query.dto.js';
import { resolveSemesterId } from '../../../shared/utils/active-academic-year.helper.js';

export const CLASS_SUPERVISOR_INCLUDE = {
  classroom: true,
  teacher: {
    include: {
      user: { select: { id: true, profile: { select: { name: true } } } },
    },
  },
  semester: {
    select: {
      id: true,
      type: true,
      academicYear: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.ClassroomSupervisorInclude;

@Injectable()
export class ClassroomSupervisorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ClassroomSupervisorQueryDto) {
    const { page = 1, limit = 10, classroomId, teacherId, semesterId } = query;
    const skip = (page - 1) * limit;

    const resolvedSemesterId = await resolveSemesterId(this.prisma, semesterId);

    const where: Prisma.ClassroomSupervisorWhereInput = {
      deletedAt: null,
      ...(classroomId && { classroomId }),
      ...(teacherId && { teacherId }),
      ...(resolvedSemesterId && { semesterId: resolvedSemesterId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.classroomSupervisor.findMany({
        where,
        include: CLASS_SUPERVISOR_INCLUDE,
        skip,
        take: limit,
        orderBy: [{ semester: { academicYear: { name: 'desc' } } }],
      }),
      this.prisma.classroomSupervisor.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.classroomSupervisor.findFirst({
      where: { id, deletedAt: null },
      include: CLASS_SUPERVISOR_INCLUDE,
    });
  }

  async findByClassroomAndSemester(classroomId: string, semesterId: string) {
    return this.prisma.classroomSupervisor.findFirst({
      where: { classroomId, semesterId, deletedAt: null },
    });
  }

  async findClassroomById(id: string) {
    return this.prisma.classroom.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, academicYearId: true },
    });
  }

  async findTeacherById(id: string) {
    return this.prisma.teacher.findFirst({ where: { id, deletedAt: null } });
  }

  async findSemesterById(id: string) {
    return this.prisma.semester.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, academicYearId: true },
    });
  }

  async create(data: {
    classroomId: string;
    teacherId: string;
    semesterId: string;
  }) {
    return this.prisma.classroomSupervisor.create({
      data,
      include: CLASS_SUPERVISOR_INCLUDE,
    });
  }

  async update(
    id: string,
    data: Partial<{
      classroomId: string;
      teacherId: string;
      semesterId: string;
    }>,
  ) {
    return this.prisma.classroomSupervisor.update({
      where: { id },
      data,
      include: CLASS_SUPERVISOR_INCLUDE,
    });
  }

  async findSoftDeletedByClassroomAndSemester(
    classroomId: string,
    semesterId: string,
  ) {
    return this.prisma.classroomSupervisor.findFirst({
      where: { classroomId, semesterId, deletedAt: { not: null } },
    });
  }

  async restore(id: string, data: { teacherId: string }) {
    return this.prisma.classroomSupervisor.update({
      where: { id },
      data: { ...data, deletedAt: null },
      include: CLASS_SUPERVISOR_INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.classroomSupervisor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
