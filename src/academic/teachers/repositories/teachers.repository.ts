import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateTeacherDto } from '../dto/request/create-teacher.request.dto.js';
import { TeacherQueryDto } from '../dto/request/teachers-query.request.dto.js';
import { ExportTeacherQueryDto } from '../dto/request/export-teachers-query.request.dto.js';
import { UpdateTeacherDto } from '../dto/request/update-teacher.request.dto.js';
import { resolveAcademicYearId } from '../../../shared/utils/active-academic-year.helper.js';

export const USER_SELECT = {
  id: true,
  identifier: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  profile: true,
} as const;

export const TEACHER_LIST_INCLUDE = {
  user: { select: USER_SELECT },
  employmentType: true,
  teacherPositions: {
    where: { isPrimary: true },
    include: { position: true },
  },
} satisfies Prisma.TeacherInclude;

export const TEACHER_DETAIL_INCLUDE = {
  user: { select: USER_SELECT },
  employmentType: true,
  addresses: {
    omit: {
      studentId: true,
      teacherId: true,
      parentId: true,
      schoolUnitId: true,
    },
    orderBy: { isPrimary: 'desc' as const },
  },
  teacherPositions: {
    include: { position: true },
    orderBy: [{ isPrimary: 'desc' as const }, { hireDate: 'desc' as const }],
  },
} satisfies Prisma.TeacherInclude;

@Injectable()
export class TeachersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async toggleUserActive(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  async findAll(query: TeacherQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      employmentTypeId,
      academicYearId,
      isActive,
    } = query;
    const skip = (page - 1) * limit;

    const resolvedAcademicYearId = await resolveAcademicYearId(
      this.prisma,
      academicYearId,
    );

    const where: Prisma.TeacherWhereInput = {
      deletedAt: null,
      ...(employmentTypeId && { employmentTypeId }),
      ...(isActive !== undefined && { user: { isActive } }),
      ...(resolvedAcademicYearId && {
        OR: [
          {
            classroomSupervisors: {
              some: { semester: { academicYearId: resolvedAcademicYearId } },
            },
          },
          {
            teachingAssignments: {
              some: { semester: { academicYearId: resolvedAcademicYearId } },
            },
          },
        ],
      }),
      ...(search && {
        OR: [
          { nip: { contains: search, mode: 'insensitive' } },
          { nuptk: { contains: search, mode: 'insensitive' } },
          {
            user: {
              profile: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        include: TEACHER_LIST_INCLUDE,
        skip,
        take: limit,
        orderBy: { user: { profile: { name: 'asc' } } },
      }),
      this.prisma.teacher.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findAllForExport(filters: ExportTeacherQueryDto) {
    const { search, employmentTypeId, isActive } = filters;

    const where: Prisma.TeacherWhereInput = {
      deletedAt: null,
      ...(employmentTypeId && { employmentTypeId }),
      ...(isActive !== undefined && { user: { isActive } }),
      ...(search && {
        OR: [
          { nip: { contains: search, mode: 'insensitive' } },
          { nuptk: { contains: search, mode: 'insensitive' } },
          {
            user: {
              profile: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        ],
      }),
    };

    return this.prisma.teacher.findMany({
      where,
      include: TEACHER_LIST_INCLUDE,
      orderBy: { user: { profile: { name: 'asc' } } },
    });
  }

  async findById(id: string) {
    return this.prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      include: TEACHER_DETAIL_INCLUDE,
    });
  }

  async findUserByIdentifier(identifier: string, schoolUnitId: string | null) {
    return this.prisma.user.findFirst({
      where: { identifier, schoolUnitId, deletedAt: null },
    });
  }

  async findProfileByNik(nik: string) {
    return this.prisma.profile.findUnique({ where: { nik } });
  }

  async findByNip(nip: string, excludeId?: string) {
    return this.prisma.teacher.findFirst({
      where: { nip, ...(excludeId && { NOT: { id: excludeId } }) },
    });
  }

  async findByNuptk(nuptk: string, excludeId?: string) {
    return this.prisma.teacher.findFirst({
      where: { nuptk, ...(excludeId && { NOT: { id: excludeId } }) },
    });
  }

  async findProfileByUserId(userId: string, nik: string) {
    return this.prisma.profile.findFirst({ where: { nik, NOT: { userId } } });
  }

  async updateProfile(userId: string, data: Prisma.ProfileUpdateInput) {
    return this.prisma.profile.update({ where: { userId }, data });
  }

  async create(
    dto: CreateTeacherDto,
    hashedPassword: string,
    organizationId: string,
    schoolUnitId: string | null,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.findFirst({
        where: {
          organizationId,
          code: 'TEACHER',
        },
      });

      const user = await tx.user.create({
        data: {
          identifier: dto.identifier ?? dto.nip ?? dto.nuptk ?? dto.nik,
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
        },
      });

      if (role) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      return tx.teacher.create({
        data: {
          userId: user.id,
          nip: dto.nip,
          nuptk: dto.nuptk,
          employmentTypeId: dto.employmentTypeId,
        },
        include: TEACHER_DETAIL_INCLUDE,
      });
    });
  }

  async update(id: string, dto: UpdateTeacherDto) {
    return this.prisma.teacher.update({
      where: { id },
      data: {
        nip: dto.nip,
        nuptk: dto.nuptk,
        employmentTypeId: dto.employmentTypeId,
      },
      include: TEACHER_DETAIL_INCLUDE,
    });
  }

  async resolveEmploymentTypeId(
    schoolUnitId: string,
    code: string,
  ): Promise<string> {
    let empType = await this.prisma.employmentType.findFirst({
      where: { schoolUnitId, code },
    });
    empType ??= await this.prisma.employmentType.create({
      data: {
        schoolUnitId,
        code,
        name: code,
      },
    });
    return empType.id;
  }

  async softDelete(id: string, userId: string) {
    return this.prisma.$transaction([
      this.prisma.teacher.update({
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
