import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateSubjectDto } from '../dto/create-subject.dto.js';
import { SubjectQueryDto } from '../dto/subject-query.dto.js';
import { UpdateSubjectDto } from '../dto/update-subject.dto.js';

export const SUBJECT_LIST_INCLUDE = {
  teachingAssignments: {
    include: {
      teacher: {
        include: { user: { include: { profile: true } } },
      },
    },
  },
} satisfies Prisma.SubjectInclude;

@Injectable()
export class SubjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SubjectQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SubjectWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: SUBJECT_LIST_INCLUDE,
      }),
      this.prisma.subject.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.subject.findFirst({ where: { id, deletedAt: null } });
  }

  async findByName(name: string) {
    return this.prisma.subject.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async update(id: string, dto: UpdateSubjectDto) {
    return this.prisma.subject.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name && { name: dto.name }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
