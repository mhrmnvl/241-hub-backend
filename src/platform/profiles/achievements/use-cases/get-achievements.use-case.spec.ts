import { Test, TestingModule } from '@nestjs/testing';
import { AchievementType } from '@prisma/client';
import { AchievementQueryDto } from '../dto/achievement-query.dto.js';
import { AchievementsRepository } from '../repositories/achievements.repository.js';
import { GetAchievementsUseCase } from './get-achievements.use-case.js';

describe('GetAchievementsUseCase', () => {
  let useCase: GetAchievementsUseCase;

  const mockRepo = { findAll: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAchievementsUseCase,
        { provide: AchievementsRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<GetAchievementsUseCase>(GetAchievementsUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated achievements', async () => {
      const query: AchievementQueryDto = {
        profileId: 'p-1',
        page: 1,
        limit: 20,
      };
      const expected = { data: [{ id: 'a-1' }], total: 1, page: 1, limit: 20 };
      mockRepo.findAll.mockResolvedValue(expected);

      const result = await useCase.execute(query);

      expect(mockRepo.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should pass enum filter correctly', async () => {
      const query: AchievementQueryDto = { type: AchievementType.PROVINCE };
      mockRepo.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });

      await useCase.execute(query);

      expect(mockRepo.findAll).toHaveBeenCalledWith(query);
    });
  });
});
