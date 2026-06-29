import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateEventDto } from '../dto/create-event.dto.js';
import { EventQueryDto } from '../dto/event-query.dto.js';
import { UpdateEventDto } from '../dto/update-event.dto.js';

const EVENT_INCLUDE = {
  classrooms: { include: { classroom: true } },
  audiences: { include: { audienceGroup: true } },
} satisfies Prisma.EventInclude;

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: EventQueryDto, schoolUnitId: string) {
    const {
      page = 1,
      limit = 10,
      classroomId,
      audienceGroupId,
      search,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      schoolUnitId,
      deletedAt: null,
      ...(classroomId && {
        classrooms: { some: { classroomId } },
      }),
      ...(audienceGroupId && {
        audiences: { some: { audienceGroupId } },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: EVENT_INCLUDE,
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string, schoolUnitId: string) {
    return this.prisma.event.findFirst({
      where: { id, schoolUnitId, deletedAt: null },
      include: EVENT_INCLUDE,
    });
  }

  async create(dto: CreateEventDto, schoolUnitId: string) {
    return this.prisma.event.create({
      data: {
        schoolUnitId,
        title: dto.title,
        description: dto.description,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        ...(dto.classroomIds?.length && {
          classrooms: {
            create: dto.classroomIds.map((classroomId) => ({ classroomId })),
          },
        }),
        ...(dto.audienceGroupIds?.length && {
          audiences: {
            create: dto.audienceGroupIds.map((audienceGroupId) => ({
              audienceGroupId,
            })),
          },
        }),
      },
      include: EVENT_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateEventDto, schoolUnitId: string) {
    return this.prisma.event.update({
      where: { id, schoolUnitId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.startTime && { startTime: new Date(dto.startTime) }),
        ...(dto.endTime && { endTime: new Date(dto.endTime) }),
        ...(dto.classroomIds !== undefined && {
          classrooms: {
            deleteMany: {},
            ...(dto.classroomIds.length > 0 && {
              create: dto.classroomIds.map((classroomId) => ({ classroomId })),
            }),
          },
        }),
        ...(dto.audienceGroupIds !== undefined && {
          audiences: {
            deleteMany: {},
            ...(dto.audienceGroupIds.length > 0 && {
              create: dto.audienceGroupIds.map((audienceGroupId) => ({
                audienceGroupId,
              })),
            }),
          },
        }),
      },
      include: EVENT_INCLUDE,
    });
  }

  async softDelete(id: string, schoolUnitId: string) {
    return this.prisma.event.update({
      where: { id, schoolUnitId },
      data: { deletedAt: new Date() },
    });
  }
}
