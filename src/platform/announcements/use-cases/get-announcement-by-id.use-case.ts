import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementsRepository } from '../repositories/announcements.repository.js';

@Injectable()
export class GetAnnouncementByIdUseCase {
  constructor(private readonly repository: AnnouncementsRepository) {}

  async execute(id: string) {
    const announcement = await this.repository.findById(id);
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }
    return announcement;
  }
}
