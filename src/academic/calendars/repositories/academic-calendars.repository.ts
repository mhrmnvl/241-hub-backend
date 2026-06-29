import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { AcademicCalendarQueryDto } from '../dto/academic-calendar-query.dto.js';
import { CreateAcademicCalendarDto } from '../dto/create-academic-calendar.dto.js';
import { UpdateAcademicCalendarDto } from '../dto/update-academic-calendar.dto.js';
import { resolveAcademicYearId } from '../../../shared/utils/active-academic-year.helper.js';

export const ACADEMIC_CALENDAR_INCLUDE = {
  academicYear: { select: { id: true, name: true } },
  semester: { select: { id: true, type: true, isActive: true } },
} satisfies Prisma.AcademicCalendarInclude;

@Injectable()
export class AcademicCalendarsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AcademicCalendarQueryDto) {
    const { page = 1, limit = 50, academicYearId, semesterId, type } = query;
    const skip = (page - 1) * limit;

    let resolvedAcademicYearId = academicYearId;
    if (!resolvedAcademicYearId && !semesterId) {
      resolvedAcademicYearId = await resolveAcademicYearId(this.prisma);
    }

    const where: Prisma.AcademicCalendarWhereInput = {
      deletedAt: null,
      ...(resolvedAcademicYearId && { academicYearId: resolvedAcademicYearId }),
      ...(semesterId && { semesterId }),
      ...(type && { type }),
    };

    const [data, total] = await Promise.all([
      this.prisma.academicCalendar.findMany({
        where,
        include: ACADEMIC_CALENDAR_INCLUDE,
        skip,
        take: limit,
        orderBy: [{ startDate: 'asc' }],
      }),
      this.prisma.academicCalendar.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.academicCalendar.findFirst({
      where: { id, deletedAt: null },
      include: ACADEMIC_CALENDAR_INCLUDE,
    });
  }

  async create(dto: CreateAcademicCalendarDto) {
    return this.prisma.academicCalendar.create({
      data: {
        academicYearId: dto.academicYearId,
        semesterId: dto.semesterId,
        title: dto.title,
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        description: dto.description,
      },
      include: ACADEMIC_CALENDAR_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateAcademicCalendarDto) {
    return this.prisma.academicCalendar.update({
      where: { id },
      data: {
        ...(dto.semesterId !== undefined && { semesterId: dto.semesterId }),
        ...(dto.title && { title: dto.title }),
        ...(dto.type && { type: dto.type }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      include: ACADEMIC_CALENDAR_INCLUDE,
    });
  }

  async softDelete(id: string) {
    return this.prisma.academicCalendar.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
