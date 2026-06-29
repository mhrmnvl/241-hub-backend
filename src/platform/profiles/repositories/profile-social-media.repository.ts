import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { CreateProfileSocialMediaDto } from '../dto/request/create-profile-social-media.request.dto.js';
import { UpdateProfileSocialMediaDto } from '../dto/request/update-profile-social-media.request.dto.js';

@Injectable()
export class ProfileSocialMediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProfileId(profileId: string) {
    return this.prisma.profileSocialMedia.findMany({
      where: { profileId, deletedAt: null },
      include: { socialMedia: true },
    });
  }

  async findByIdAndProfile(id: string, profileId: string) {
    return this.prisma.profileSocialMedia.findFirst({
      where: { id, profileId, deletedAt: null },
    });
  }

  async findByPlatformAndProfile(socialMediaId: string, profileId: string) {
    return this.prisma.profileSocialMedia.findFirst({
      where: { socialMediaId, profileId, deletedAt: null },
    });
  }

  async create(profileId: string, dto: CreateProfileSocialMediaDto) {
    return this.prisma.profileSocialMedia.create({
      data: {
        profileId,
        socialMediaId: dto.socialMediaId,
        username: dto.username,
      },
      include: { socialMedia: true },
    });
  }

  async update(id: string, dto: UpdateProfileSocialMediaDto) {
    return this.prisma.profileSocialMedia.update({
      where: { id },
      data: dto,
      include: { socialMedia: true },
    });
  }

  async remove(id: string) {
    return this.prisma.profileSocialMedia.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countByPlatformId(socialMediaId: string) {
    return this.prisma.profileSocialMedia.count({
      where: { socialMediaId, deletedAt: null },
    });
  }
}
