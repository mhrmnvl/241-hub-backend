import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import {
  CreateTeacherPositionDto,
  UpdateTeacherPositionDto,
} from '../dto/request/teacher-position.request.dto.js';

@Injectable()
export class TeacherPositionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teacherId: string) {
    return this.prisma.teacherPosition.findMany({
      where: { teacherId, position: { isActive: true } },
      include: { position: true },
      orderBy: [{ isPrimary: 'desc' }, { hireDate: 'desc' }],
    });
  }

  async findLinkById(teacherId: string, linkId: string) {
    return this.prisma.teacherPosition.findFirst({
      where: { id: linkId, teacherId },
    });
  }

  async findPosition(positionId: string) {
    return this.prisma.position.findUnique({ where: { id: positionId } });
  }

  async findAssignment(teacherId: string, positionId: string, hireDate: Date) {
    return this.prisma.teacherPosition.findUnique({
      where: {
        teacherId_positionId_hireDate: { teacherId, positionId, hireDate },
      },
    });
  }

  async assign(teacherId: string, dto: CreateTeacherPositionDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isPrimary) {
        await tx.teacherPosition.updateMany({
          where: { teacherId, isPrimary: true },
          data: { isPrimary: false },
        });
      }
      return tx.teacherPosition.create({
        data: {
          teacherId,
          positionId: dto.positionId,
          hireDate: new Date(dto.hireDate),
          isPrimary: dto.isPrimary ?? false,
        },
        include: { position: true },
      });
    });
  }

  async update(
    teacherId: string,
    linkId: string,
    dto: UpdateTeacherPositionDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isPrimary) {
        await tx.teacherPosition.updateMany({
          where: { teacherId, isPrimary: true, NOT: { id: linkId } },
          data: { isPrimary: false },
        });
      }
      return tx.teacherPosition.update({
        where: { id: linkId },
        data: {
          ...(dto.hireDate && { hireDate: new Date(dto.hireDate) }),
          ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
        },
        include: { position: true },
      });
    });
  }

  async remove(linkId: string) {
    return this.prisma.teacherPosition.update({
      where: { id: linkId },
      data: { deletedAt: new Date() },
    });
  }
}
