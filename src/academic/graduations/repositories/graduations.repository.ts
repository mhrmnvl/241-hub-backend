import { Injectable } from '@nestjs/common';
import { Prisma, StudentStatus } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateStudentGraduationDto } from '../dto/create-student-graduation.dto.js';
import { StudentGraduationQueryDto } from '../dto/student-graduation-query.dto.js';
import { UpdateStudentGraduationDto } from '../dto/update-student-graduation.dto.js';
import { resolveAcademicYearId } from '../../../shared/utils/active-academic-year.helper.js';

const INCLUDE = {
  student: {
    include: {
      user: { select: { profile: true, identifier: true } },
    },
  },
  academicYear: true,
} satisfies Prisma.StudentGraduationInclude;

@Injectable()
export class GraduationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: StudentGraduationQueryDto) {
    const { page = 1, limit = 10, academicYearId, search } = query;
    const skip = (page - 1) * limit;

    const resolvedAcademicYearId = await resolveAcademicYearId(
      this.prisma,
      academicYearId,
    );

    const where: Prisma.StudentGraduationWhereInput = {
      deletedAt: null,
      ...(resolvedAcademicYearId && { academicYearId: resolvedAcademicYearId }),
      ...(search && {
        student: {
          OR: [
            { nis: { contains: search, mode: 'insensitive' } },
            { nisn: { contains: search, mode: 'insensitive' } },
            {
              user: {
                profile: {
                  name: { contains: search, mode: 'insensitive' },
                },
              },
            },
          ],
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.studentGraduation.findMany({
        where,
        include: INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.studentGraduation.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.studentGraduation.findFirst({
      where: { id, deletedAt: null },
      include: INCLUDE,
    });
  }

  async findByStudentId(studentId: string) {
    return this.prisma.studentGraduation.findFirst({
      where: { studentId, deletedAt: null },
    });
  }

  async create(dto: CreateStudentGraduationDto) {
    return this.prisma.$transaction(async (tx) => {
      const graduation = await tx.studentGraduation.create({
        data: {
          studentId: dto.studentId,
          academicYearId: dto.academicYearId,
          ...(dto.graduationDate && {
            graduationDate: new Date(dto.graduationDate),
          }),
          ...(dto.certificateNo && { certificateNo: dto.certificateNo }),
          ...(dto.note && { note: dto.note }),
        },
        include: INCLUDE,
      });

      await tx.student.update({
        where: { id: dto.studentId },
        data: { status: StudentStatus.GRADUATED },
      });

      return graduation;
    });
  }

  async update(id: string, dto: UpdateStudentGraduationDto) {
    const { studentId, academicYearId, graduationDate, ...rest } = dto;
    return this.prisma.studentGraduation.update({
      where: { id },
      data: {
        ...rest,
        ...(studentId && { studentId }),
        ...(academicYearId && { academicYearId }),
        ...(graduationDate && { graduationDate: new Date(graduationDate) }),
      },
      include: INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.studentGraduation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
