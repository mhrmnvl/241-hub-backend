import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateTimeSlotDto } from '../dto/create-time-slot.dto.js';
import { UpdateTimeSlotDto } from '../dto/update-time-slot.dto.js';

@Injectable()
export class TimeSlotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDateTime(timeStr: string): Date {
    return new Date(`1970-01-01T${timeStr}:00.000Z`);
  }

  async findAll(schoolUnitId: string) {
    return this.prisma.timeSlot.findMany({
      where: { schoolUnitId, deletedAt: null },
      include: { type: true },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string, schoolUnitId: string) {
    return this.prisma.timeSlot.findFirst({
      where: { id, schoolUnitId, deletedAt: null },
      include: { type: true },
    });
  }

  async findByOrder(order: number, schoolUnitId: string, excludeId?: string) {
    return this.prisma.timeSlot.findFirst({
      where: {
        order,
        schoolUnitId,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      include: { type: true },
    });
  }

  async create(dto: CreateTimeSlotDto, schoolUnitId: string) {
    return this.prisma.timeSlot.create({
      data: {
        schoolUnitId,
        name: dto.name,
        startTime: this.toDateTime(dto.startTime),
        endTime: this.toDateTime(dto.endTime),
        order: dto.order,
        typeId: dto.typeId,
      },
      include: { type: true },
    });
  }

  async update(id: string, dto: UpdateTimeSlotDto, schoolUnitId: string) {
    return this.prisma.timeSlot.update({
      where: { id, schoolUnitId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.startTime && { startTime: this.toDateTime(dto.startTime) }),
        ...(dto.endTime && { endTime: this.toDateTime(dto.endTime) }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.typeId !== undefined && { typeId: dto.typeId }),
      },
      include: { type: true },
    });
  }

  async remove(id: string, schoolUnitId: string) {
    return this.prisma.timeSlot.update({
      where: { id, schoolUnitId },
      data: { deletedAt: new Date() },
    });
  }

  async countSchedulesUsing(timeSlotId: string, schoolUnitId: string) {
    return this.prisma.schedule.count({
      where: {
        timeSlotId,
        deletedAt: null,
        timeSlot: { schoolUnitId },
      },
    });
  }
}
