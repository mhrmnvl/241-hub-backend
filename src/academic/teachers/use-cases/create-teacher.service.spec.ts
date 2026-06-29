import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserGender } from '@prisma/client';
import { CreateTeacherDto } from '../dto/request/create-teacher.request.dto.js';
import { TeachersRepository } from '../repositories/teachers.repository.js';
import { CreateTeacherUseCase } from './create-teacher.use-case.js';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('CreateTeacherUseCase', () => {
  let useCase: CreateTeacherUseCase;

  const mockRepository = {
    findUserByIdentifier: jest.fn(),
    findProfileByNik: jest.fn(),
    findByNip: jest.fn(),
    findByNuptk: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTeacherUseCase,
        { provide: TeachersRepository, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<CreateTeacherUseCase>(CreateTeacherUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const dto: CreateTeacherDto = {
      identifier: 'guru001',
      password: 'P@ssw0rd!',
      name: 'Budi Santoso',
      nik: '3578010101700001',
      gender: UserGender.MALE,
      birthPlace: 'Surabaya',
      birthDate: '1980-06-15',
      employmentTypeId: 'emp-type-uuid',
    };

    const organizationId = 'org-1';
    const schoolUnitId = 'school-1';

    const mockTeacher = {
      id: 'emp-1',
      user: { id: 'u-1', identifier: 'guru001' },
      profile: { id: 'p-1', name: 'Budi Santoso', nik: '3578010101700001' },
    };

    it('should create an teacher successfully', async () => {
      mockRepository.findUserByIdentifier.mockResolvedValue(null);
      mockRepository.findProfileByNik.mockResolvedValue(null);
      mockRepository.findByNip.mockResolvedValue(null);
      mockRepository.findByNuptk.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockTeacher);

      const result = await useCase.execute(dto, organizationId, schoolUnitId);

      expect(mockRepository.findUserByIdentifier).toHaveBeenCalledWith(
        'guru001',
        schoolUnitId,
      );
      expect(mockRepository.findProfileByNik).toHaveBeenCalledWith(
        '3578010101700001',
      );

      expect(mockRepository.findByNip).not.toHaveBeenCalled();
      expect(mockRepository.findByNuptk).not.toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith(
        dto,
        'hashed-password',
        organizationId,
        schoolUnitId,
      );
      expect(result).toEqual(mockTeacher);
    });

    it('should throw ConflictException when identifier is already taken', async () => {
      mockRepository.findUserByIdentifier.mockResolvedValue({
        id: 'existing-u',
      });
      mockRepository.findProfileByNik.mockResolvedValue(null);
      mockRepository.findByNip.mockResolvedValue(null);
      mockRepository.findByNuptk.mockResolvedValue(null);

      await expect(
        useCase.execute(dto, organizationId, schoolUnitId),
      ).rejects.toThrow(ConflictException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when NIK is already registered', async () => {
      mockRepository.findUserByIdentifier.mockResolvedValue(null);
      mockRepository.findProfileByNik.mockResolvedValue({ id: 'existing-p' });
      mockRepository.findByNip.mockResolvedValue(null);
      mockRepository.findByNuptk.mockResolvedValue(null);

      await expect(
        useCase.execute(dto, organizationId, schoolUnitId),
      ).rejects.toThrow(ConflictException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when NIP is already registered', async () => {
      const dtoWithNip: CreateTeacherDto = {
        ...dto,
        nip: '198006152005011001',
      };

      mockRepository.findUserByIdentifier.mockResolvedValue(null);
      mockRepository.findProfileByNik.mockResolvedValue(null);
      mockRepository.findByNip.mockResolvedValue({ id: 'existing-emp' });
      mockRepository.findByNuptk.mockResolvedValue(null);

      await expect(
        useCase.execute(dtoWithNip, organizationId, schoolUnitId),
      ).rejects.toThrow(ConflictException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when NUPTK is already registered', async () => {
      const dtoWithNuptk: CreateTeacherDto = {
        ...dto,
        nuptk: '1234567890123456',
      };

      mockRepository.findUserByIdentifier.mockResolvedValue(null);
      mockRepository.findProfileByNik.mockResolvedValue(null);
      mockRepository.findByNip.mockResolvedValue(null);
      mockRepository.findByNuptk.mockResolvedValue({ id: 'existing-emp' });

      await expect(
        useCase.execute(dtoWithNuptk, organizationId, schoolUnitId),
      ).rejects.toThrow(ConflictException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should NOT check NIP when nip is not provided', async () => {
      mockRepository.findUserByIdentifier.mockResolvedValue(null);
      mockRepository.findProfileByNik.mockResolvedValue(null);
      mockRepository.findByNip.mockResolvedValue(null);
      mockRepository.findByNuptk.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockTeacher);

      await useCase.execute(dto, organizationId, schoolUnitId);

      expect(mockRepository.findByNip).not.toHaveBeenCalled();
    });
  });
});
