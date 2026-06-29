import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from '../repositories/auth.repository.js';
import { GetProfileUseCase } from './get-profile.use-case.js';

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;

  const mockAuthRepository = {
    findUserById: jest.fn(),
  };

  const mockUser = {
    id: 'user-uuid-1',
    identifier: 'admin',
    organizationId: 'org-uuid-1',
    schoolUnitId: 'school-uuid-1',
    isActive: true,
    profile: { fullName: 'Admin User' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProfileUseCase,
        { provide: AuthRepository, useValue: mockAuthRepository },
      ],
    }).compile();

    useCase = module.get<GetProfileUseCase>(GetProfileUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return user profile data', async () => {
      mockAuthRepository.findUserById.mockResolvedValue(mockUser);

      const result = await useCase.execute('user-uuid-1');

      expect(result).toEqual({
        id: mockUser.id,
        identifier: mockUser.identifier,
        organizationId: mockUser.organizationId,
        schoolUnitId: mockUser.schoolUnitId,
        isActive: mockUser.isActive,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockAuthRepository.findUserById.mockResolvedValue(null);

      await expect(useCase.execute('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
