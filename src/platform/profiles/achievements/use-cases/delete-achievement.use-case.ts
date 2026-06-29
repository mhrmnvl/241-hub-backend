import { Injectable, NotFoundException } from '@nestjs/common';
import { AchievementsRepository } from '../repositories/achievements.repository.js';

@Injectable()
export class DeleteAchievementUseCase {
  constructor(private readonly repo: AchievementsRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Achievement not found');
    await this.repo.softDelete(id);
    return { message: 'Achievement deleted successfully' };
  }
}
