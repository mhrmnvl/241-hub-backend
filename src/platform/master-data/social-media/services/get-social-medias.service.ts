import { Injectable } from '@nestjs/common';
import { SocialMediaQueryDto } from '../dto/social-media-query.dto.js';
import { SocialMediaRepository } from '../repositories/social-media.repository.js';

@Injectable()
export class GetSocialMediasService {
  constructor(private readonly repo: SocialMediaRepository) {}

  async execute(query: SocialMediaQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const { data, total } = await this.repo.findAll({ skip, take: limit });

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
