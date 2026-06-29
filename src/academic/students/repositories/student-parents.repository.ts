import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { StudentParentQueryDto } from '../dto/student-parent-query.dto.js';
import { CreateStudentParentDto } from '../dto/create-student-parent.dto.js';
import { UpdateStudentParentDto } from '../dto/update-student-parent.dto.js';

const STUDENT_PARENT_INCLUDE = {
  student: {
    include: {
      user: { include: { profile: { select: { name: true } } } },
    },
  },
  parent: {
    include: { occupation: true },
  },
} satisfies Prisma.StudentParentInclude;

@Injectable()
export class StudentParentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: StudentParentQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      studentId,
      parentId,
      relation,
      isPrimary,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentParentWhereInput = {
      student: { deletedAt: null },
      parent: { deletedAt: null },
      ...(studentId && { studentId }),
      ...(parentId && { parentId }),
      ...(relation && { relation }),
      ...(isPrimary !== undefined && { isPrimary }),
      ...(search && {
        OR: [
          { student: { nis: { contains: search, mode: 'insensitive' } } },
          { student: { nisn: { contains: search, mode: 'insensitive' } } },
          {
            student: {
              user: {
                profile: { name: { contains: search, mode: 'insensitive' } },
              },
            },
          },
          { parent: { name: { contains: search, mode: 'insensitive' } } },
          { parent: { nik: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.studentParent.findMany({
        where,
        include: STUDENT_PARENT_INCLUDE,
        skip,
        take: limit,
        orderBy: [{ isPrimary: 'desc' }, { relation: 'asc' }],
      }),
      this.prisma.studentParent.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.studentParent.findFirst({
      where: {
        id,
        student: { deletedAt: null },
        parent: { deletedAt: null },
      },
      include: STUDENT_PARENT_INCLUDE,
    });
  }

  async findPair(studentId: string, parentId: string) {
    return this.prisma.studentParent.findUnique({
      where: { studentId_parentId: { studentId, parentId } },
    });
  }

  async findStudent(id: string) {
    return this.prisma.student.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
  }

  async findParent(id: string) {
    return this.prisma.parent.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
  }

  async create(dto: CreateStudentParentDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isPrimary) {
        await tx.studentParent.updateMany({
          where: { studentId: dto.studentId, isPrimary: true },
          data: { isPrimary: false },
        });
      }
      return tx.studentParent.create({
        data: {
          studentId: dto.studentId,
          parentId: dto.parentId,
          relation: dto.relation,
          isPrimary: dto.isPrimary ?? false,
        },
        include: STUDENT_PARENT_INCLUDE,
      });
    });
  }

  async update(id: string, studentId: string, dto: UpdateStudentParentDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.isPrimary) {
        await tx.studentParent.updateMany({
          where: { studentId, isPrimary: true, NOT: { id } },
          data: { isPrimary: false },
        });
      }
      return tx.studentParent.update({
        where: { id },
        data: dto,
        include: STUDENT_PARENT_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    return this.prisma.studentParent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
