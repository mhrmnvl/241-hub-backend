import { Test, TestingModule } from '@nestjs/testing';
import { Day } from '@prisma/client';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto.js';
import {
  CreateScheduleUseCase,
  DeleteScheduleUseCase,
  GetScheduleByIdUseCase,
  GetSchedulesUseCase,
  GetSchedulesByClassroomUseCase,
  UpdateScheduleUseCase,
  BatchUpsertScheduleUseCase,
} from '../use-cases/schedule.use-case.js';
import { SchedulesController } from './schedules.controller.js';

describe('SchedulesController', () => {
  let controller: SchedulesController;

  const mockGetAll = { execute: jest.fn() };
  const mockGetById = { execute: jest.fn() };
  const mockGetByClassroom = { execute: jest.fn() };
  const mockCreate = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };
  const mockBatchUpsert = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        { provide: GetSchedulesUseCase, useValue: mockGetAll },
        { provide: GetScheduleByIdUseCase, useValue: mockGetById },
        {
          provide: GetSchedulesByClassroomUseCase,
          useValue: mockGetByClassroom,
        },
        { provide: CreateScheduleUseCase, useValue: mockCreate },
        { provide: UpdateScheduleUseCase, useValue: mockUpdate },
        { provide: DeleteScheduleUseCase, useValue: mockDelete },
        { provide: BatchUpsertScheduleUseCase, useValue: mockBatchUpsert },
      ],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to GetSchedulesUseCase', async () => {
      mockGetAll.execute.mockResolvedValue({ data: [] });
      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(mockGetAll.execute).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('findOne', () => {
    it('should delegate to GetScheduleByIdUseCase', async () => {
      mockGetById.execute.mockResolvedValue({ id: 'sch-1' });
      const result = await controller.findOne('sch-1');
      expect(mockGetById.execute).toHaveBeenCalledWith('sch-1');
      expect(result).toEqual({ id: 'sch-1' });
    });
  });

  describe('create', () => {
    it('should delegate to CreateScheduleUseCase', async () => {
      const dto: CreateScheduleDto = {
        teachingAssignmentId: 'ta-1',
        timeSlotId: 'ts-1',
        day: Day.MONDAY,
      };
      mockCreate.execute.mockResolvedValue({ id: 'new' });
      await controller.create(dto);
      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateScheduleUseCase', async () => {
      const dto: UpdateScheduleDto = { day: Day.TUESDAY };
      mockUpdate.execute.mockResolvedValue({ id: 'sch-1' });
      await controller.update('sch-1', dto);
      expect(mockUpdate.execute).toHaveBeenCalledWith('sch-1', dto);
    });
  });

  describe('remove', () => {
    it('should delegate to DeleteScheduleUseCase', async () => {
      mockDelete.execute.mockResolvedValue(undefined);
      await controller.remove('sch-1');
      expect(mockDelete.execute).toHaveBeenCalledWith('sch-1');
    });
  });
});
