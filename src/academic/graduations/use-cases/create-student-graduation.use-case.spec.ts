import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GraduationsRepository } from '../repositories/graduations.repository.js';
import { CreateStudentGraduationUseCase } from './create-student-graduation.use-case.js';

describe('CreateStudentGraduationUseCase', () => {
  let useCase: CreateStudentGraduationUseCase;

  const mockRepo = {
    findByStudentId: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStudentGraduationUseCase,
        { provide: GraduationsRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<CreateStudentGraduationUseCase>(
      CreateStudentGraduationUseCase,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create graduation successfully', async () => {
    mockRepo.findByStudentId.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({ id: 'grad-1' });

    const result = await useCase.execute({
      studentId: 'stu-1',
      academicYearId: 'ay-1',
    });

    expect(mockRepo.create).toHaveBeenCalled();
    expect(result.id).toBe('grad-1');
  });

  it('should throw ConflictException if student already graduated', async () => {
    mockRepo.findByStudentId.mockResolvedValue({ id: 'existing' });

    await expect(
      useCase.execute({ studentId: 'stu-1', academicYearId: 'ay-1' }),
    ).rejects.toThrow(ConflictException);
  });
});
