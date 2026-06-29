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
export class SchoolUnitAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySchoolUnit(schoolUnitId: string) {
    return this.prisma.address.findFirst({
      where: { schoolUnitId },
      omit: ADDRESS_OMIT,
    });
  }

  async findBySchoolUnitRaw(schoolUnitId: string) {
    return this.prisma.address.findFirst({ where: { schoolUnitId } });
  }

  async create(schoolUnitId: string, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: { ...dto, schoolUnitId, isPrimary: true },
      omit: ADDRESS_OMIT,
    });
  }

  async update(id: string, dto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { id },
      data: dto,
      omit: ADDRESS_OMIT,
    });
  }

  async remove(id: string) {
    return this.prisma.address.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
