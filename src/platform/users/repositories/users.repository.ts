import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { UserQueryDto } from '../dto/request/users-query.request.dto.js';

export const PUBLIC_USER_SELECT = {
  id: true,
  identifier: true,
  organizationId: true,
  schoolUnitId: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  userRoles: {
    select: {
      role: true,
    },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, organizationId, schoolUnitId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(organizationId && { organizationId }),
      ...(schoolUnitId && { schoolUnitId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: PUBLIC_USER_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: PUBLIC_USER_SELECT,
    });
  }

  async findByIdWithPassword(id: string) {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  async findByIdentifier(identifier: string, schoolUnitId: string | null) {
    return this.prisma.user.findFirst({
      where: { identifier, schoolUnitId, deletedAt: null },
      select: PUBLIC_USER_SELECT,
    });
  }

  async findByIdentifierWithPassword(
    identifier: string,
    schoolUnitId: string | null,
  ) {
    return this.prisma.user.findFirst({
      where: { identifier, schoolUnitId, deletedAt: null },
    });
  }

  async existsByIdentifier(
    identifier: string,
    schoolUnitId: string | null,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { identifier, schoolUnitId, deletedAt: null },
      select: { id: true },
    });
    return !!user;
  }

  async existsById(id: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return !!user;
  }

  async create(data: {
    identifier: string;
    passwordHash: string;
    organizationId: string;
    schoolUnitId?: string | null;
  }) {
    return this.prisma.user.create({
      data,
      select: PUBLIC_USER_SELECT,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: PUBLIC_USER_SELECT,
    });
  }

  async remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
      select: PUBLIC_USER_SELECT,
    });
  }
}
