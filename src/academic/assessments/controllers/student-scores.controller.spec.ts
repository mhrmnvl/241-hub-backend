import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateStudentScoreDto,
  UpdateStudentScoreDto,
} from '../dto/student-score.dto.js';
import {
  CreateStudentScoreUseCase,
  DeleteStudentScoreUseCase,
  GetStudentScoreByIdUseCase,
  GetStudentScoresUseCase,
  UpdateStudentScoreUseCase,
} from '../use-cases/student-score.use-case.js';
import { StudentScoresController } from './student-scores.controller.js';

describe('StudentScoresController', () => {
  let controller: StudentScoresController;
  const mockGetAll = { execute: jest.fn() };
  const mockGetById = { execute: jest.fn() };
  const mockCreate = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentScoresController],
      providers: [
        { provide: GetStudentScoresUseCase, useValue: mockGetAll },
        { provide: GetStudentScoreByIdUseCase, useValue: mockGetById },
        { provide: CreateStudentScoreUseCase, useValue: mockCreate },
        { provide: UpdateStudentScoreUseCase, useValue: mockUpdate },
        { provide: DeleteStudentScoreUseCase, useValue: mockDelete },
      ],
    }).compile();
    controller = module.get<StudentScoresController>(StudentScoresController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate', async () => {
      mockGetAll.execute.mockResolvedValue({ data: [] });
      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(mockGetAll.execute).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('findOne', () => {
    it('should delegate', async () => {
      mockGetById.execute.mockResolvedValue({ id: 'ss-1' });
      const result = await controller.findOne('ss-1');
      expect(mockGetById.execute).toHaveBeenCalledWith('ss-1');
      expect(result).toEqual({ id: 'ss-1' });
    });
  });

  describe('create', () => {
    it('should delegate', async () => {
      const dto: CreateStudentScoreDto = {
        enrollmentId: 'e1',
        assessmentItemId: 'a1',
        score: 85,
      };
      mockCreate.execute.mockResolvedValue({ id: 'new' });
      await controller.create(dto);
      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should delegate', async () => {
      const dto: UpdateStudentScoreDto = { score: 90 };
      mockUpdate.execute.mockResolvedValue({ id: 'ss-1' });
      await controller.update('ss-1', dto);
      expect(mockUpdate.execute).toHaveBeenCalledWith('ss-1', dto);
    });
  });

  describe('remove', () => {
    it('should delegate', async () => {
      mockDelete.execute.mockResolvedValue(undefined);
      await controller.remove('ss-1');
      expect(mockDelete.execute).toHaveBeenCalledWith('ss-1');
    });
  });
});
