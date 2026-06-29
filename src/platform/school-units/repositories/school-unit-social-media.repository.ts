import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import {
  CreateSchoolUnitSocialMediaDto,
  UpdateSchoolUnitSocialMediaDto,
} from '../dto/school-unit-social-media.dto.js';

@Injectable()
export class SchoolUnitSocialMediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(schoolUnitId: string) {
    return this.prisma.schoolUnitSocialMedia.findMany({
      where: { schoolUnitId, deletedAt: null },
      include: { socialMedia: true },
    });
  }

  async findByPlatform(schoolUnitId: string, socialMediaId: string) {
    return this.prisma.schoolUnitSocialMedia.findFirst({
      where: { socialMediaId, schoolUnitId, deletedAt: null },
    });
  }

  async findById(id: string, schoolUnitId: string) {
    return this.prisma.schoolUnitSocialMedia.findFirst({
      where: { id, schoolUnitId, deletedAt: null },
    });
  }

  async create(schoolUnitId: string, dto: CreateSchoolUnitSocialMediaDto) {
    return this.prisma.schoolUnitSocialMedia.create({
      data: {
        schoolUnitId,
        socialMediaId: dto.socialMediaId,
        username: dto.username,
      },
      include: { socialMedia: true },
    });
  }

  async update(id: string, dto: UpdateSchoolUnitSocialMediaDto) {
    return this.prisma.schoolUnitSocialMedia.update({
      where: { id },
      data: dto,
      include: { socialMedia: true },
    });
  }

  async remove(id: string) {
    return this.prisma.schoolUnitSocialMedia.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countByPlatformId(socialMediaId: string) {
    return this.prisma.schoolUnitSocialMedia.count({
      where: { socialMediaId, deletedAt: null },
    });
  }
}
