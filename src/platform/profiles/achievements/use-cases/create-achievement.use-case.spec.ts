import { Test, TestingModule } from '@nestjs/testing';
import { AchievementType } from '@prisma/client';
import { CreateAchievementDto } from '../dto/create-achievement.dto.js';
import { AchievementsRepository } from '../repositories/achievements.repository.js';
import { CreateAchievementUseCase } from './create-achievement.use-case.js';

describe('CreateAchievementUseCase', () => {
  let useCase: CreateAchievementUseCase;

  const mockRepo = { create: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAchievementUseCase,
        { provide: AchievementsRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<CreateAchievementUseCase>(CreateAchievementUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const dto: CreateAchievementDto = {
      profileId: 'profile-uuid',
      name: 'Olimpiade Matematika',
      level: 'Juara 1',
      type: AchievementType.NATIONAL,
      year: 2024,
    };

    it('should create achievement and return result', async () => {
      const created = { id: 'ach-1', ...dto };
      mockRepo.create.mockResolvedValue(created);

      const result = await useCase.execute(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });
});
