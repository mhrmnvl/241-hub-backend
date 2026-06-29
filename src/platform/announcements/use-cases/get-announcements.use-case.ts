import { Injectable } from '@nestjs/common';
import { AnnouncementQueryDto } from '../dto/announcement-query.dto.js';
import { AnnouncementsRepository } from '../repositories/announcements.repository.js';

@Injectable()
export class GetAnnouncementsUseCase {
  constructor(private readonly repository: AnnouncementsRepository) {}

  async execute(query: AnnouncementQueryDto) {
    const { data, total, page, limit } = await this.repository.findAll(query);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
