import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.role.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, organizationId: string) {
    return this.prisma.role.findFirst({
      where: { id, organizationId },
    });
  }

  async findByCode(code: string, organizationId: string) {
    return this.prisma.role.findFirst({
      where: { code, organizationId },
    });
  }

  async create(
    organizationId: string,
    data: { name: string; code: string; description?: string },
  ) {
    return this.prisma.role.create({
      data: {
        ...data,
        organizationId,
        isSystem: false,
      },
    });
  }

  async update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignRoleToUser(userId: string, roleId: string) {
    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    return this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  async findUserRole(userId: string, roleId: string) {
    return this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }
}
