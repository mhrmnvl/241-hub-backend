import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SemesterType } from '@prisma/client';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { CreateSemesterDto } from '../dto/create-semester.dto.js';
import { SemestersRepository } from '../repositories/semesters.repository.js';
import { CreateSemesterUseCase } from './create-semester.use-case.js';

describe('CreateSemesterUseCase', () => {
  let useCase: CreateSemesterUseCase;

  const mockRepository = {
    findByAcademicYearAndType: jest.fn(),
    deactivateAll: jest.fn(),
    create: jest.fn(),
  };

  const mockAcademicYearsRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSemesterUseCase,
        { provide: SemestersRepository, useValue: mockRepository },
        {
          provide: AcademicYearsRepository,
          useValue: mockAcademicYearsRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateSemesterUseCase>(CreateSemesterUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const dto: CreateSemesterDto = {
      academicYearId: 'ay-1',
      type: SemesterType.GANJIL,
    };

    it('should create a semester successfully', async () => {
      mockAcademicYearsRepository.findById.mockResolvedValue({
        id: 'ay-1',
        name: '2024/2025',
      });
      mockRepository.findByAcademicYearAndType.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: 'sem-1',
        type: SemesterType.GANJIL,
        isActive: false,
        academicYear: { id: 'ay-1', name: '2024/2025' },
      });

      const result = await useCase.execute(dto);

      expect(mockAcademicYearsRepository.findById).toHaveBeenCalledWith('ay-1');
      expect(mockRepository.findByAcademicYearAndType).toHaveBeenCalledWith(
        'ay-1',
        SemesterType.GANJIL,
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        academicYearId: 'ay-1',
        type: SemesterType.GANJIL,
        isActive: false,
      });
      expect(result.type).toBe(SemesterType.GANJIL);
    });

    it('should throw NotFoundException when academic year not found', async () => {
      mockAcademicYearsRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when semester type already exists', async () => {
      mockAcademicYearsRepository.findById.mockResolvedValue({
        id: 'ay-1',
        name: '2024/2025',
      });
      mockRepository.findByAcademicYearAndType.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should deactivate all others when isActive is true', async () => {
      const activeDto: CreateSemesterDto = {
        ...dto,
        isActive: true,
      };

      mockAcademicYearsRepository.findById.mockResolvedValue({
        id: 'ay-1',
        name: '2024/2025',
      });
      mockRepository.findByAcademicYearAndType.mockResolvedValue(null);
      mockRepository.deactivateAll.mockResolvedValue({ count: 1 });
      mockRepository.create.mockResolvedValue({
        id: 'sem-1',
        type: SemesterType.GANJIL,
        isActive: true,
        academicYear: { id: 'ay-1', name: '2024/2025' },
      });

      await useCase.execute(activeDto);

      expect(mockRepository.deactivateAll).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith({
        academicYearId: 'ay-1',
        type: SemesterType.GANJIL,
        isActive: true,
      });
    });

    it('should NOT deactivate others when isActive is false/undefined', async () => {
      mockAcademicYearsRepository.findById.mockResolvedValue({
        id: 'ay-1',
        name: '2024/2025',
      });
      mockRepository.findByAcademicYearAndType.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: 'sem-1',
        type: SemesterType.GANJIL,
        isActive: false,
        academicYear: { id: 'ay-1', name: '2024/2025' },
      });

      await useCase.execute(dto);

      expect(mockRepository.deactivateAll).not.toHaveBeenCalled();
    });
  });
});
