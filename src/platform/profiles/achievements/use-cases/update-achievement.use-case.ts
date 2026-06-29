import { Injectable, NotFoundException } from '@nestjs/common';
import { AchievementsRepository } from '../repositories/achievements.repository.js';
import { UpdateAchievementDto } from '../dto/update-achievement.dto.js';

@Injectable()
export class UpdateAchievementUseCase {
  constructor(private readonly repo: AchievementsRepository) {}

  async execute(id: string, dto: UpdateAchievementDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Achievement not found');
    return this.repo.update(id, dto);
  }
}
