import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../../../shared/dto/address.dto.js';
import { PrismaService } from '../../../core/database/prisma.service.js';

const ADDRESS_OMIT = {
  studentId: true,
  teacherId: true,
  parentId: true,
  schoolUnitId: true,
} satisfies Prisma.AddressOmit;

@Injectable()
export class StudentAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(studentId: string) {
    return this.prisma.address.findMany({
      where: { studentId },
      omit: ADDRESS_OMIT,
      orderBy: { isPrimary: 'desc' },
    });
  }

  async findOne(studentId: string, addressId: string) {
    return this.prisma.address.findFirst({
      where: { id: addressId, studentId },
    });
  }

  async clearPrimary(studentId: string) {
    return this.prisma.address.updateMany({
      where: { studentId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  async clearPrimaryExclude(studentId: string, excludeId: string) {
    return this.prisma.address.updateMany({
      where: { studentId, isPrimary: true, NOT: { id: excludeId } },
      data: { isPrimary: false },
    });
  }

  async create(studentId: string, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: { ...dto, studentId },
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
