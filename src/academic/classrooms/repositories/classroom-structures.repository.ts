import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { ClassroomStructureQueryDto } from '../dto/classroom-structure-query.dto.js';
import { resolveSemesterId } from '../../../shared/utils/active-academic-year.helper.js';

const STUDENT_SELECT = {
  id: true,
  nis: true,
  user: { select: { id: true, profile: { select: { name: true } } } },
};

export const CLASSROOM_STRUCTURE_INCLUDE = {
  classroom: true,
  semester: {
    select: {
      id: true,
      type: true,
      academicYear: { select: { id: true, name: true } },
    },
  },
  president: { select: STUDENT_SELECT },
  vicePresident: { select: STUDENT_SELECT },
  secretary: { select: STUDENT_SELECT },
  treasurer: { select: STUDENT_SELECT },
} satisfies Prisma.ClassroomStructureInclude;

@Injectable()
export class ClassroomStructuresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ClassroomStructureQueryDto) {
    const { page = 1, limit = 10, classroomId, semesterId } = query;
    const skip = (page - 1) * limit;

    const resolvedSemesterId = await resolveSemesterId(this.prisma, semesterId);

    const where: Prisma.ClassroomStructureWhereInput = {
      deletedAt: null,
      ...(classroomId && { classroomId }),
      ...(resolvedSemesterId && { semesterId: resolvedSemesterId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.classroomStructure.findMany({
        where,
        include: CLASSROOM_STRUCTURE_INCLUDE,
        skip,
        take: limit,
        orderBy: { classroomId: 'asc' },
      }),
      this.prisma.classroomStructure.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.classroomStructure.findFirst({
      where: { id, deletedAt: null },
      include: CLASSROOM_STRUCTURE_INCLUDE,
    });
  }

  async findByClassroomAndSemester(classroomId: string, semesterId: string) {
    return this.prisma.classroomStructure.findFirst({
      where: { classroomId, semesterId, deletedAt: null },
      include: CLASSROOM_STRUCTURE_INCLUDE,
    });
  }

  async findClassroomById(id: string) {
    return this.prisma.classroom.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
  }

  async findSemesterById(id: string) {
    return this.prisma.semester.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
  }

  async findActiveEnrollment(
    studentId: string,
    classroomId: string,
    semesterId: string,
  ) {
    return this.prisma.studentEnrollment.findFirst({
      where: {
        studentId,
        classroomId,
        semesterId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  async findByStudentAndSemester(studentId: string, semesterId: string) {
    return this.prisma.classroomStructure.findFirst({
      where: {
        semesterId,
        deletedAt: null,
        OR: [
          { presidentId: studentId },
          { vicePresidentId: studentId },
          { secretaryId: studentId },
          { treasurerId: studentId },
        ],
      },
      include: { classroom: { select: { code: true } } },
    });
  }

  async create(data: {
    classroomId: string;
    semesterId: string;
    presidentId?: string;
    vicePresidentId?: string;
    secretaryId?: string;
    treasurerId?: string;
  }) {
    return this.prisma.classroomStructure.create({
      data,
      include: CLASSROOM_STRUCTURE_INCLUDE,
    });
  }

  async update(
    id: string,
    data: Partial<{
      presidentId: string | null;
      vicePresidentId: string | null;
      secretaryId: string | null;
      treasurerId: string | null;
    }>,
  ) {
    return this.prisma.classroomStructure.update({
      where: { id },
      data,
      include: CLASSROOM_STRUCTURE_INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.classroomStructure.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
