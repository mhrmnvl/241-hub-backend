import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../core/database/prisma.module.js';
import { AchievementsController } from './controllers/achievements.controller.js';
import { AchievementsRepository } from './repositories/achievements.repository.js';
import { CreateAchievementUseCase } from './use-cases/create-achievement.use-case.js';
import { GetAchievementsUseCase } from './use-cases/get-achievements.use-case.js';
import { GetAchievementByIdUseCase } from './use-cases/get-achievement-by-id.use-case.js';
import { UpdateAchievementUseCase } from './use-cases/update-achievement.use-case.js';
import { DeleteAchievementUseCase } from './use-cases/delete-achievement.use-case.js';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementsController],
  providers: [
    AchievementsRepository,
    CreateAchievementUseCase,
    GetAchievementsUseCase,
    GetAchievementByIdUseCase,
    UpdateAchievementUseCase,
    DeleteAchievementUseCase,
  ],
})
export class AchievementsModule {}
