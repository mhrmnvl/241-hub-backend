import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateOrganizationDto } from '../dto/create-organization.dto.js';
import { UpdateOrganizationDto } from '../dto/update-organization.dto.js';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.organization.findMany({
      where: { deletedAt: null },
      include: { type: true, tenant: true },
    });
  }

  async findById(id: string) {
    return this.prisma.organization.findUnique({
      where: { id, deletedAt: null },
      include: {
        schoolUnits: {
          where: { deletedAt: null },
        },
        type: true,
        tenant: true,
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.organization.findUnique({
      where: { code, deletedAt: null },
    });
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string) {
    return this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
