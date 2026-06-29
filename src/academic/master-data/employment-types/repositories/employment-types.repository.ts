import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  CreateEmploymentTypeDto,
  UpdateEmploymentTypeDto,
} from '../dto/create-employment-type.dto.js';
import { EmploymentTypeQueryDto } from '../dto/employment-type-query.dto.js';

@Injectable()
export class EmploymentTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(schoolUnitId: string, query: EmploymentTypeQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EmploymentTypeWhereInput = {
      schoolUnitId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.employmentType.findMany({
        where,
        skip,
        take: limit,
        orderBy: { code: 'asc' },
      }),
      this.prisma.employmentType.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(schoolUnitId: string, id: string) {
    return this.prisma.employmentType.findFirst({
      where: { id, schoolUnitId, deletedAt: null },
    });
  }

  async findByCode(schoolUnitId: string, code: string, excludeId?: string) {
    return this.prisma.employmentType.findFirst({
      where: {
        schoolUnitId,
        deletedAt: null,
        code: { equals: code, mode: 'insensitive' },
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async create(schoolUnitId: string, dto: CreateEmploymentTypeDto) {
    return this.prisma.employmentType.create({
      data: {
        ...dto,
        schoolUnitId,
      },
    });
  }

  async update(schoolUnitId: string, id: string, dto: UpdateEmploymentTypeDto) {
    return this.prisma.employmentType.update({
      where: { id, schoolUnitId },
      data: dto,
    });
  }

  async remove(schoolUnitId: string, id: string) {
    return this.prisma.employmentType.update({
      where: { id, schoolUnitId },
      data: { deletedAt: new Date() },
    });
  }

  async countTeachersWithEmploymentType(id: string) {
    return this.prisma.teacher.count({
      where: { employmentTypeId: id, deletedAt: null },
    });
  }
}
