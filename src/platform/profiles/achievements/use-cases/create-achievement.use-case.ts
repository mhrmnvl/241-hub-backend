import { Injectable } from '@nestjs/common';
import { AchievementsRepository } from '../repositories/achievements.repository.js';
import { CreateAchievementDto } from '../dto/create-achievement.dto.js';

@Injectable()
export class CreateAchievementUseCase {
  constructor(private readonly repo: AchievementsRepository) {}

  async execute(dto: CreateAchievementDto) {
    return this.repo.create(dto);
  }
}
