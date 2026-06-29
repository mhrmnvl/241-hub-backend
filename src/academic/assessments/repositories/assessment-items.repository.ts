import { Injectable } from '@nestjs/common';
import { AssessmentType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { AssessmentItemQueryDto } from '../dto/assessment-item.dto.js';

@Injectable()
export class AssessmentItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AssessmentItemQueryDto) {
    const { page = 1, limit = 10, teachingAssignmentId, type } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.AssessmentItemWhereInput = {
      deletedAt: null,
      ...(teachingAssignmentId && { teachingAssignmentId }),
      ...(type && { type }),
    };
    const [data, total] = await Promise.all([
      this.prisma.assessmentItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          teachingAssignment: { include: { subject: true, classroom: true } },
        },
      }),
      this.prisma.assessmentItem.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.assessmentItem.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: {
    teachingAssignmentId: string;
    name: string;
    type: AssessmentType;
    weight?: number;
    maxScore?: number;
  }) {
    return this.prisma.assessmentItem.create({ data });
  }

  async update(id: string, data: Prisma.AssessmentItemUpdateInput) {
    return this.prisma.assessmentItem.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return this.prisma.assessmentItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
