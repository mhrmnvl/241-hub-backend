import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { UpdateProfileDto } from '../dto/request/update-profile.request.dto.js';

export const PROFILE_INCLUDE = {
  socialMedias: {
    where: { deletedAt: null },
    include: { socialMedia: true },
  },
  achievements: { where: { deletedAt: null } },
  scholarships: { where: { deletedAt: null } },
  educationalHistories: { where: { deletedAt: null } },
} satisfies Prisma.ProfileInclude;

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: PROFILE_INCLUDE,
    });
  }

  async findDetailByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        identifier: true,
        organizationId: true,
        schoolUnitId: true,
        userRoles: {
          include: {
            role: true,
          },
        },
        profile: { include: PROFILE_INCLUDE },
        teacher: {
          include: {
            addresses: { where: { deletedAt: null } },
            teacherPositions: {
              where: { deletedAt: null },
              include: { position: true },
              orderBy: [
                { isPrimary: 'desc' as const },
                { hireDate: 'desc' as const },
              ],
            },
            teachingAssignments: {
              where: { deletedAt: null },
              include: { subject: true },
            },
          },
        },
        student: {
          include: {
            addresses: { where: { deletedAt: null } },
            enrollments: {
              where: { deletedAt: null },
              include: {
                classroom: true,
                semester: { include: { academicYear: true } },
              },
              orderBy: { enrolledAt: 'desc' as const },
            },
            parents: {
              where: { deletedAt: null },
              include: {
                parent: {
                  include: {
                    occupation: true,
                    education: true,
                    addresses: { where: { deletedAt: null } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByNik(nik: string, excludeUserId?: string) {
    return this.prisma.profile.findFirst({
      where: { nik, ...(excludeUserId && { NOT: { userId: excludeUserId } }) },
    });
  }

  async findByEmail(email: string, excludeUserId?: string) {
    return this.prisma.profile.findFirst({
      where: {
        email,
        ...(excludeUserId && { NOT: { userId: excludeUserId } }),
      },
    });
  }

  async findByPhone(phone: string, excludeUserId?: string) {
    return this.prisma.profile.findFirst({
      where: {
        phone,
        ...(excludeUserId && { NOT: { userId: excludeUserId } }),
      },
    });
  }

  async findAllWithSocialMedias(params: {
    skip?: number;
    take?: number;
    search?: string;
    roleCode?: string;
  }) {
    const { skip, take, search, roleCode } = params;

    const where: Prisma.ProfileWhereInput = {};

    if (roleCode) {
      where.user = {
        userRoles: {
          some: {
            role: {
              code: roleCode,
            },
          },
        },
      };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.profile.findMany({
      skip,
      take,
      where,
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
        socialMedias: {
          where: { deletedAt: null },
          include: { socialMedia: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async countAllWithSocialMedias(params: {
    search?: string;
    roleCode?: string;
  }) {
    const { search, roleCode } = params;

    const where: Prisma.ProfileWhereInput = {};

    if (roleCode) {
      where.user = {
        userRoles: {
          some: {
            role: {
              code: roleCode,
            },
          },
        },
      };
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.profile.count({ where });
  }

  async update(userId: string, dto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
        ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
      },
      include: PROFILE_INCLUDE,
    });
  }
}
