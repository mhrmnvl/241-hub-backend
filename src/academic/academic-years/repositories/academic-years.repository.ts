import { Injectable } from '@nestjs/common';
import { Prisma, SemesterType } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { AcademicYearQueryDto } from '../dto/academic-year-query.dto.js';

@Injectable()
export class AcademicYearsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(schoolUnitId: string, query: AcademicYearQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AcademicYearWhereInput = {
      schoolUnitId,
      deletedAt: null,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.academicYear.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.academicYear.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.academicYear.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByName(schoolUnitId: string, name: string) {
    return this.prisma.academicYear.findFirst({
      where: { schoolUnitId, name, deletedAt: null },
    });
  }

  async findLatestAcademicYear(schoolUnitId: string) {
    return this.prisma.academicYear.findFirst({
      where: { schoolUnitId, deletedAt: null },
      orderBy: { name: 'desc' },
    });
  }

  async findClassesByAcademicYear(academicYearId: string) {
    return this.prisma.classroom.findMany({
      where: { academicYearId, deletedAt: null },
      select: {
        gradeId: true,
        code: true,
        name: true,
        capacity: true,
        curriculumId: true,
        isActive: true,
      },
    });
  }

  async create(schoolUnitId: string, data: { name: string; isActive: boolean }) {
    return this.prisma.academicYear.create({
      data: {
        schoolUnitId,
        name: data.name,
        isActive: data.isActive,
      },
    });
  }

  async createWithSemestersAndClasses(
    schoolUnitId: string,
    ayData: { name: string; isActive: boolean },
    copyClasses: boolean,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const academicYear = await tx.academicYear.create({
        data: {
          schoolUnitId,
          name: ayData.name,
          isActive: ayData.isActive,
        },
      });

      const [semesterGanjil, semesterGenap] = await Promise.all([
        tx.semester.create({
          data: {
            academicYearId: academicYear.id,
            type: SemesterType.GANJIL,
            isActive: false,
          },
        }),
        tx.semester.create({
          data: {
            academicYearId: academicYear.id,
            type: SemesterType.GENAP,
            isActive: false,
          },
        }),
      ]);

      let classroomsCreated = 0;

      if (copyClasses) {
        const previousAy = await tx.academicYear.findFirst({
          where: {
            schoolUnitId,
            deletedAt: null,
            id: { not: academicYear.id },
          },
          orderBy: { name: 'desc' },
        });

        if (previousAy) {
          const previousClasses = await tx.classroom.findMany({
            where: { academicYearId: previousAy.id, deletedAt: null },
            select: {
              gradeId: true,
              code: true,
              name: true,
              capacity: true,
              curriculumId: true,
              isActive: true,
            },
          });

          if (previousClasses.length > 0) {
            await tx.classroom.createMany({
              data: previousClasses.map((classroom) => ({
                academicYearId: academicYear.id,
                gradeId: classroom.gradeId,
                code: classroom.code,
                name: classroom.name,
                capacity: classroom.capacity,
                curriculumId: classroom.curriculumId,
                isActive: classroom.isActive,
              })),
            });
            classroomsCreated = previousClasses.length;
          }
        }
      }

      return {
        academicYear,
        semesters: [semesterGanjil, semesterGenap],
        classroomsCreated,
      };
    });
  }

  async update(id: string, data: Prisma.AcademicYearUpdateInput) {
    return this.prisma.academicYear.update({ where: { id }, data });
  }

  async deactivateAll(schoolUnitId: string) {
    return this.prisma.academicYear.updateMany({
      where: { schoolUnitId, isActive: true },
      data: { isActive: false },
    });
  }

  async activateById(schoolUnitId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.academicYear.updateMany({
        where: { schoolUnitId, isActive: true },
        data: { isActive: false },
      });
      return tx.academicYear.update({
        where: { id },
        data: { isActive: true },
      });
    });
  }

  async hasRelatedData(id: string): Promise<boolean> {
    const count = await this.prisma.semester.count({
      where: {
        academicYearId: id,
        deletedAt: null,
        enrollments: { some: { deletedAt: null } },
      },
      take: 1,
    });
    return count > 0;
  }

  async countActive(schoolUnitId: string): Promise<number> {
    return this.prisma.academicYear.count({
      where: { schoolUnitId, isActive: true, deletedAt: null },
    });
  }

  async deactivateSemestersByAcademicYearId(academicYearId: string) {
    return this.prisma.semester.updateMany({
      where: { academicYearId, isActive: true, deletedAt: null },
      data: { isActive: false },
    });
  }

  async softDelete(id: string) {
    return this.prisma.academicYear.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
