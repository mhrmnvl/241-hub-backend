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
export class TeacherAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teacherId: string) {
    return this.prisma.address.findMany({
      where: { teacherId },
      omit: ADDRESS_OMIT,
      orderBy: { isPrimary: 'desc' },
    });
  }

  async findById(teacherId: string, addressId: string) {
    return this.prisma.address.findFirst({
      where: { id: addressId, teacherId },
    });
  }

  async create(teacherId: string, dto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isPrimary) {
        await tx.address.updateMany({
          where: { teacherId, isPrimary: true },
          data: { isPrimary: false },
        });
      }
      return tx.address.create({
        data: { ...dto, teacherId },
        omit: ADDRESS_OMIT,
      });
    });
  }

  async update(teacherId: string, addressId: string, dto: UpdateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isPrimary) {
        await tx.address.updateMany({
          where: { teacherId, isPrimary: true, NOT: { id: addressId } },
          data: { isPrimary: false },
        });
      }
      return tx.address.update({
        where: { id: addressId },
        data: dto,
        omit: ADDRESS_OMIT,
      });
    });
  }

  async remove(addressId: string) {
    return this.prisma.address.update({
      where: { id: addressId },
      data: { deletedAt: new Date() },
    });
  }
}
