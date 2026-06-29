import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SemesterType } from '@prisma/client';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { UpdateSemesterDto } from '../dto/update-semester.dto.js';
import { SemestersRepository } from '../repositories/semesters.repository.js';
import { UpdateSemesterUseCase } from './update-semester.use-case.js';

describe('UpdateSemesterUseCase', () => {
  let useCase: UpdateSemesterUseCase;

  const mockRepository = {
    findById: jest.fn(),
    findByAcademicYearAndType: jest.fn(),
    update: jest.fn(),
  };

  const mockAcademicYearsRepository = {
    findById: jest.fn(),
  };

  const existingSemester = {
    id: 'sem-1',
    type: SemesterType.GANJIL,
    isActive: false,
    academicYear: { id: 'ay-1', name: '2024/2025' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSemesterUseCase,
        { provide: SemestersRepository, useValue: mockRepository },
        {
          provide: AcademicYearsRepository,
          useValue: mockAcademicYearsRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateSemesterUseCase>(UpdateSemesterUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update semester fields successfully', async () => {
      const dto: UpdateSemesterDto = { type: SemesterType.GENAP };
      const updatedSemester = { ...existingSemester, type: SemesterType.GENAP };
      mockRepository.findById.mockResolvedValue(existingSemester);
      mockRepository.findByAcademicYearAndType.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(updatedSemester);

      const result = await useCase.execute('sem-1', dto);

      expect(result.type).toBe(SemesterType.GENAP);
      expect(mockRepository.update).toHaveBeenCalledWith('sem-1', dto);
    });

    it('should throw NotFoundException when semester not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute('non-existent', { type: SemesterType.GENAP }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate academic year when changing academicYearId', async () => {
      const dto: UpdateSemesterDto = { academicYearId: 'ay-new' };
      mockRepository.findById.mockResolvedValue(existingSemester);
      mockAcademicYearsRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('sem-1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when changing type causes duplicate', async () => {
      const dto: UpdateSemesterDto = { type: SemesterType.GENAP };
      mockRepository.findById.mockResolvedValue(existingSemester);
      mockRepository.findByAcademicYearAndType.mockResolvedValue({
        id: 'sem-other',
      });

      await expect(useCase.execute('sem-1', dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
