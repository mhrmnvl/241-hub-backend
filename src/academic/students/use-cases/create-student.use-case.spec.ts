import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserGender } from '@prisma/client';
import { SemestersRepository } from '../../semesters/index.js';
import { EnrollmentsRepository } from '../../enrollments/index.js';
import { CreateStudentDto } from '../dto/create-student.dto.js';
import { StudentsRepository } from '../repositories/students.repository.js';
import { CreateStudentUseCase } from './create-student.use-case.js';

describe('CreateStudentUseCase', () => {
  let useCase: CreateStudentUseCase;

  const mockStudentRepo = {
    findByNis: jest.fn(),
    findByNisn: jest.fn(),
    create: jest.fn(),
  };

  const mockEnrollmentRepo = {
    create: jest.fn(),
  };

  const mockSemesterRepo = {
    findActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStudentUseCase,
        { provide: StudentsRepository, useValue: mockStudentRepo },
        { provide: EnrollmentsRepository, useValue: mockEnrollmentRepo },
        { provide: SemestersRepository, useValue: mockSemesterRepo },
      ],
    }).compile();

    useCase = module.get<CreateStudentUseCase>(CreateStudentUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const dto: CreateStudentDto = {
      identifier: 'siswa001',
      password: 'P@ssw0rd!',
      name: 'Ahmad Fauzi',
      nik: '3578010101080001',
      gender: UserGender.MALE,
      birthPlace: 'Malang',
      birthDate: '2008-01-01',
      gradeId: '550e8400-e29b-41d4-a716-446655440099',
      classroomId: '550e8400-e29b-41d4-a716-446655440004',
      nis: '2024001',
      nisn: '0012345678',
    };

    const mockStudent = {
      id: 'stu-1',
      userId: 'usr-1',
      nis: '2024001',
      nisn: '0012345678',
      status: 'ACTIVE',
      gradeId: '550e8400-e29b-41d4-a716-446655440099',
    };

    it('should create a student with auto-enrollment', async () => {
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue(null);
      mockStudentRepo.create.mockResolvedValue({ student: mockStudent });
      mockSemesterRepo.findActive.mockResolvedValue({ id: 'sem-active' });
      mockEnrollmentRepo.create.mockResolvedValue({ id: 'enr-1' });

      const result = await useCase.execute(dto, 'org-1', 'unit-1');

      expect(mockStudentRepo.findByNis).toHaveBeenCalledWith(dto.nis);
      expect(mockStudentRepo.findByNisn).toHaveBeenCalledWith(dto.nisn);
      expect(mockStudentRepo.create).toHaveBeenCalledWith(
        dto,
        'org-1',
        'unit-1',
      );
      expect(mockEnrollmentRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: 'stu-1',
          classroomId: dto.classroomId,
          semesterId: 'sem-active',
        }),
      );
      expect(result).toEqual({
        id: 'stu-1',
        userId: 'usr-1',
        nis: '2024001',
        nisn: '0012345678',
        status: 'ACTIVE',
        gradeId: '550e8400-e29b-41d4-a716-446655440099',
      });
    });

    it('should create a student without enrollment (no classroomId)', async () => {
      const ppdbDto: CreateStudentDto = { ...dto, classroomId: undefined };
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue(null);
      mockStudentRepo.create.mockResolvedValue({ student: mockStudent });

      const result = await useCase.execute(ppdbDto, 'org-1', 'unit-1');

      expect(mockSemesterRepo.findActive).not.toHaveBeenCalled();
      expect(mockEnrollmentRepo.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 'stu-1',
        userId: 'usr-1',
        nis: '2024001',
        nisn: '0012345678',
        status: 'ACTIVE',
        gradeId: '550e8400-e29b-41d4-a716-446655440099',
      });
    });

    it('should throw ConflictException when NIS is already registered', async () => {
      mockStudentRepo.findByNis.mockResolvedValue({
        id: 'stu-existing',
        nis: '2024001',
      });
      mockStudentRepo.findByNisn.mockResolvedValue(null);

      await expect(useCase.execute(dto, 'org-1', 'unit-1')).rejects.toThrow(
        ConflictException,
      );
      expect(mockStudentRepo.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when NISN is already registered', async () => {
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue({
        id: 'stu-existing',
        nisn: '0012345678',
      });

      await expect(useCase.execute(dto, 'org-1', 'unit-1')).rejects.toThrow(
        ConflictException,
      );
      expect(mockStudentRepo.create).not.toHaveBeenCalled();
    });
  });
});
