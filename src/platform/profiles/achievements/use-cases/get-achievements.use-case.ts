import { Injectable } from '@nestjs/common';
import { AchievementsRepository } from '../repositories/achievements.repository.js';
import { AchievementQueryDto } from '../dto/achievement-query.dto.js';

@Injectable()
export class GetAchievementsUseCase {
  constructor(private readonly repo: AchievementsRepository) {}

  async execute(query: AchievementQueryDto) {
    return this.repo.findAll(query);
  }
}
