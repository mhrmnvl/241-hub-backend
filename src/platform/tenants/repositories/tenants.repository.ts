import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateTenantDto } from '../dto/create-tenant.dto.js';
import { UpdateTenantDto } from '../dto/update-tenant.dto.js';

@Injectable()
export class TenantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.tenant.findMany({
      where: { deletedAt: null },
      include: { plan: true },
    });
  }

  async findById(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id, deletedAt: null },
      include: { plan: true, organizations: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.tenant.findUnique({
      where: { slug, deletedAt: null },
      include: { plan: true },
    });
  }

  async create(dto: CreateTenantDto) {
    const trialDays = 14; // Default to 14 days if not specified or trial
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

    return this.prisma.tenant.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        planId: dto.planId,
        status: dto.status || 'TRIAL',
        logoUrl: dto.logoUrl,
        primaryColor: dto.primaryColor,
        trialEndsAt: dto.status === 'TRIAL' || !dto.status ? trialEndsAt : null,
      },
      include: { plan: true },
    });
  }

  async update(id: string, dto: UpdateTenantDto) {
    return this.prisma.tenant.update({
      where: { id },
      data: dto,
      include: { plan: true },
    });
  }

  async softDelete(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
