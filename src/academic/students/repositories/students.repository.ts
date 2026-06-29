import { Injectable } from '@nestjs/common';
import { Prisma, StudentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { UpdateProfileDto } from '../../../platform/profiles/index.js';
import { CreateStudentDto } from '../dto/create-student.dto.js';
import { ExportStudentQueryDto } from '../dto/export-student-query.dto.js';
import { StudentQueryDto } from '../dto/student-query.dto.js';
import { UpdateStudentDto } from '../dto/update-student.dto.js';

export const STUDENT_INCLUDE = {
  user: {
    select: {
      id: true,
      identifier: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  },
  grade: true,
  enrollments: {
    where: { deletedAt: null },
    include: {
      classroom: true,
      semester: { include: { academicYear: true } },
    },
    orderBy: { enrolledAt: 'desc' as const },
  },
} satisfies Prisma.StudentInclude;

export type { RequestUser } from '../types/student.types.js';

@Injectable()
export class StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async toggleUserActive(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  async findAll(query: StudentQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      semesterId,
      classroomId,
      status,
      isActive,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(semesterId && {
        enrollments: {
          some: {
            semesterId,
            deletedAt: null,
            ...(classroomId && { classroomId }),
          },
        },
      }),
      ...(!semesterId &&
        classroomId && {
          enrollments: { some: { classroomId, deletedAt: null } },
        }),
      ...(isActive !== undefined && { user: { isActive } }),
      ...(search && {
        OR: [
          { nis: { contains: search, mode: 'insensitive' } },
          { nisn: { contains: search, mode: 'insensitive' } },
          {
            user: {
              profile: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: STUDENT_INCLUDE,
        skip,
        take: limit,
        orderBy: { user: { profile: { name: 'asc' } } },
      }),
      this.prisma.student.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findAllForExport(filters: ExportStudentQueryDto) {
    const { search, classroomId, isActive } = filters;

    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(classroomId && {
        enrollments: { some: { classroomId, deletedAt: null } },
      }),
      ...(isActive !== undefined && { user: { isActive } }),
      ...(search && {
        OR: [
          { nis: { contains: search, mode: 'insensitive' } },
          { nisn: { contains: search, mode: 'insensitive' } },
          {
            user: {
              profile: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      }),
    };

    return this.prisma.student.findMany({
      where,
      include: STUDENT_INCLUDE,
      orderBy: { user: { profile: { name: 'asc' } } },
    });
  }

  async findById(id: string) {
    return this.prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: STUDENT_INCLUDE,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.student.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });
  }

  async findByNis(nis: string) {
    return this.prisma.student.findFirst({ where: { nis } });
  }

  async findByNisn(nisn: string) {
    return this.prisma.student.findFirst({ where: { nisn } });
  }

  async isStudent(userId: string): Promise<boolean> {
    const role = await this.prisma.userRole.findFirst({
      where: {
        userId,
        role: { code: 'STUDENT' },
      },
    });
    return !!role;
  }

  async create(
    dto: CreateStudentDto,
    organizationId: string,
    schoolUnitId: string | null,
  ) {
    const hashedPassword = await bcrypt.hash(dto.password!, 10);

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findFirst({
        where: {
          organizationId,
          code: 'STUDENT',
        },
      });

      const user = await tx.user.create({
        data: {
          identifier: dto.identifier!,
          passwordHash: hashedPassword,
          organizationId,
          schoolUnitId,
          profile: {
            create: {
              name: dto.name,
              nik: dto.nik,
              gender: dto.gender,
              birthPlace: dto.birthPlace,
              birthDate: new Date(dto.birthDate),
              email: dto.email,
              phone: dto.phone,
            },
          },
          student: {
            create: {
              nis: dto.nis,
              nisn: dto.nisn,
              status: StudentStatus.ACTIVE,
              ...(dto.gradeId && {
                gradeId: dto.gradeId,
              }),
            },
          },
        },
        include: { student: { include: STUDENT_INCLUDE } },
      });

      if (role) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      return user;
    });
  }

  async update(id: string, dto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: dto,
      include: STUDENT_INCLUDE,
    });
  }

  async updateStatus(id: string, status: StudentStatus) {
    return this.prisma.student.update({
      where: { id },
      data: { status },
    });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const student = await this.prisma.student.findFirst({
      where: { id, deletedAt: null },
      select: { userId: true },
    });
    if (!student) return null;
    return this.prisma.profile.update({
      where: { userId: student.userId },
      data: {
        ...dto,
        ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
      },
    });
  }

  async softDelete(id: string, userId: string) {
    return this.prisma.$transaction([
      this.prisma.student.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date(), isActive: false },
      }),
    ]);
  }
}
