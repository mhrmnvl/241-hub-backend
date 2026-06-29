import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from '../index.js';
import { ProfileSocialMediaRepository } from '../repositories/profile-social-media.repository.js';

@Injectable()
export class GetProfileSocialMediasUseCase {
  constructor(
    private readonly profileRepo: ProfilesRepository,
    private readonly socialRepo: ProfileSocialMediaRepository,
  ) {}

  async execute(userId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile)
      throw new NotFoundException(`Profile for user ID ${userId} not found`);
    return this.socialRepo.findAllByProfileId(profile.id);
  }
}
