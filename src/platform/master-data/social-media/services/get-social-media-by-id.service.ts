import { Injectable, NotFoundException } from '@nestjs/common';
import { SocialMediaRepository } from '../repositories/social-media.repository.js';

@Injectable()
export class GetSocialMediaByIdService {
  constructor(private readonly repo: SocialMediaRepository) {}

  async execute(id: string) {
    const platform = await this.repo.findById(id);
    if (!platform)
      throw new NotFoundException(`Platform with ID ${id} not found`);
    return platform;
  }
}
