import { Injectable, NotFoundException } from '@nestjs/common';
import { AchievementsRepository } from '../repositories/achievements.repository.js';

@Injectable()
export class GetAchievementByIdUseCase {
  constructor(private readonly repo: AchievementsRepository) {}

  async execute(id: string) {
    const achievement = await this.repo.findById(id);
    if (!achievement) throw new NotFoundException('Achievement not found');
    return achievement;
  }
}
