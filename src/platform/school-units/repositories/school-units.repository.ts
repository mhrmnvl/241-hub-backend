import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateSchoolUnitDto } from '../dto/create-school-unit.dto.js';
import { UpdateSchoolUnitDto } from '../dto/update-school-unit.dto.js';

const SCHOOL_UNIT_INCLUDE = {
  socialMedias: { include: { socialMedia: true } },
  type: true,
  organization: true,
} satisfies Prisma.SchoolUnitInclude;

@Injectable()
export class SchoolUnitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.schoolUnit.findUnique({
      where: { id, deletedAt: null },
      include: SCHOOL_UNIT_INCLUDE,
    });
  }

  async findByDomain(host: string) {
    if (!host) return null;
    const cleanHost = host.split(':')[0].toLowerCase();
    const baseDomain = process.env.BASE_DOMAIN || 'schoolhub.id';

    if (cleanHost.endsWith(`.${baseDomain}`)) {
      const subdomain = cleanHost.substring(
        0,
        cleanHost.length - baseDomain.length - 1,
      );
      return this.prisma.schoolUnit.findUnique({
        where: { subdomain, deletedAt: null },
        include: SCHOOL_UNIT_INCLUDE,
      });
    }

    return this.prisma.schoolUnit.findUnique({
      where: { customDomain: cleanHost, deletedAt: null },
      include: SCHOOL_UNIT_INCLUDE,
    });
  }

  async create(organizationId: string, dto: CreateSchoolUnitDto) {
    return this.prisma.schoolUnit.create({
      data: {
        ...dto,
        organizationId,
      },
      include: SCHOOL_UNIT_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateSchoolUnitDto) {
    return this.prisma.schoolUnit.update({
      where: { id },
      data: dto,
      include: SCHOOL_UNIT_INCLUDE,
    });
  }
}
