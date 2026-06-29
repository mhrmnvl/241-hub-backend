import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateParentDto } from '../dto/create-parent.dto.js';
import { UpdateParentDto } from '../dto/update-parent.dto.js';
import { ParentQueryDto } from '../dto/parent-query.dto.js';

const ADDRESS_OMIT = {
  studentId: true,
  teacherId: true,
  parentId: true,
  schoolUnitId: true,
} satisfies Prisma.AddressOmit;

export const PARENT_LIST_INCLUDE = {
  occupation: true,
  _count: { select: { addresses: true, studentParents: true } },
} satisfies Prisma.ParentInclude;

export const PARENT_DETAIL_INCLUDE = {
  occupation: true,
  addresses: { omit: ADDRESS_OMIT, orderBy: { isPrimary: 'desc' } },
  studentParents: {
    where: { student: { deletedAt: null } },
    orderBy: { isPrimary: 'desc' },
    include: {
      student: {
        select: {
          id: true,
          nis: true,
          nisn: true,
          status: true,
          user: { select: { profile: { select: { name: true } } } },
        },
      },
    },
  },
} satisfies Prisma.ParentInclude;

@Injectable()
export class ParentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ParentQueryDto) {
    const { page = 1, limit = 10, search, occupationId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ParentWhereInput = {
      deletedAt: null,
      ...(occupationId && { occupationId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nik: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.parent.findMany({
        where,
        include: PARENT_LIST_INCLUDE,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.parent.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.parent.findFirst({
      where: { id, deletedAt: null },
      include: PARENT_DETAIL_INCLUDE,
    });
  }

  async findByNik(nik: string, excludeId?: string) {
    return this.prisma.parent.findFirst({
      where: {
        nik,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async findOccupationById(id: string) {
    return this.prisma.occupation.findUnique({ where: { id } });
  }

  async create(dto: CreateParentDto) {
    return this.prisma.parent.create({
      data: { ...dto, birthDate: new Date(dto.birthDate) },
      include: PARENT_DETAIL_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateParentDto) {
    return this.prisma.parent.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
      },
      include: PARENT_DETAIL_INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.parent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
