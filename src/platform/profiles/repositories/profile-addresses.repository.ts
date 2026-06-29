import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../../../shared/dto/address.dto.js';

const ADDRESS_OMIT = {
  studentId: true,
  teacherId: true,
  parentId: true,
  schoolUnitId: true,
} satisfies Prisma.AddressOmit;

@Injectable()
export class ProfileAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string) {
    return this.prisma.address.findMany({
      where: {
        OR: [{ student: { userId } }, { teacher: { userId } }],
      },
      omit: ADDRESS_OMIT,
      orderBy: { isPrimary: 'desc' },
    });
  }

  async findAddressForUser(addressId: string, userId: string) {
    return this.prisma.address.findFirst({
      where: {
        id: addressId,
        OR: [{ student: { userId } }, { teacher: { userId } }],
      },
    });
  }

  async findStudentByUserId(userId: string) {
    return this.prisma.student.findUnique({ where: { userId } });
  }

  async findTeacherByUserId(userId: string) {
    return this.prisma.teacher.findUnique({ where: { userId } });
  }

  async clearPrimaryForStudent(studentId: string) {
    return this.prisma.address.updateMany({
      where: { studentId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  async clearPrimaryForTeacher(teacherId: string) {
    return this.prisma.address.updateMany({
      where: { teacherId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  async clearPrimaryForStudentExclude(studentId: string, excludeId: string) {
    return this.prisma.address.updateMany({
      where: { studentId, isPrimary: true, NOT: { id: excludeId } },
      data: { isPrimary: false },
    });
  }

  async clearPrimaryForTeacherExclude(teacherId: string, excludeId: string) {
    return this.prisma.address.updateMany({
      where: { teacherId, isPrimary: true, NOT: { id: excludeId } },
      data: { isPrimary: false },
    });
  }

  async create(
    dto: CreateAddressDto,
    ownerId: { studentId?: string; teacherId?: string },
  ) {
    return this.prisma.address.create({
      data: { ...dto, ...ownerId },
      omit: ADDRESS_OMIT,
    });
  }

  async update(addressId: string, dto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
      omit: ADDRESS_OMIT,
    });
  }

  async remove(addressId: string) {
    return this.prisma.address.update({
      where: { id: addressId },
      data: { deletedAt: new Date() },
    });
  }
}
