import { Test, TestingModule } from '@nestjs/testing';
import { CreateTimeSlotDto } from '../dto/create-time-slot.dto.js';
import { UpdateTimeSlotDto } from '../dto/update-time-slot.dto.js';
import { CreateTimeSlotUseCase } from '../use-cases/create-time-slot.use-case.js';
import { DeleteTimeSlotUseCase } from '../use-cases/delete-time-slot.use-case.js';
import { GetTimeSlotByIdUseCase } from '../use-cases/get-time-slot-by-id.use-case.js';
import { GetTimeSlotsUseCase } from '../use-cases/get-time-slots.use-case.js';
import { UpdateTimeSlotUseCase } from '../use-cases/update-time-slot.use-case.js';
import { TimeSlotsController } from './time-slots.controller.js';

describe('TimeSlotsController', () => {
  let controller: TimeSlotsController;

  const mockGetTimeSlotsService = { execute: jest.fn() };
  const mockGetTimeSlotByIdService = { execute: jest.fn() };
  const mockCreateTimeSlotService = { execute: jest.fn() };
  const mockUpdateTimeSlotService = { execute: jest.fn() };
  const mockDeleteTimeSlotService = { execute: jest.fn() };

  const user = { schoolUnitId: 'school-1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSlotsController],
      providers: [
        { provide: GetTimeSlotsUseCase, useValue: mockGetTimeSlotsService },
        {
          provide: GetTimeSlotByIdUseCase,
          useValue: mockGetTimeSlotByIdService,
        },
        { provide: CreateTimeSlotUseCase, useValue: mockCreateTimeSlotService },
        { provide: UpdateTimeSlotUseCase, useValue: mockUpdateTimeSlotService },
        { provide: DeleteTimeSlotUseCase, useValue: mockDeleteTimeSlotService },
      ],
    }).compile();

    controller = module.get<TimeSlotsController>(TimeSlotsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to GetTimeSlotsUseCase with schoolUnitId', async () => {
      const expected = [
        { id: 'ts-1', name: 'Jam ke-1', order: 1 },
        { id: 'ts-2', name: 'Jam ke-2', order: 2 },
      ];
      mockGetTimeSlotsService.execute.mockResolvedValue(expected);

      const result = await controller.findAll(user);

      expect(mockGetTimeSlotsService.execute).toHaveBeenCalledWith(
        user.schoolUnitId,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate to GetTimeSlotByIdUseCase with id and schoolUnitId', async () => {
      const id = 'ts-1';
      const expected = { id: 'ts-1', name: 'Jam ke-1' };
      mockGetTimeSlotByIdService.execute.mockResolvedValue(expected);

      const result = await controller.findOne(id, user);

      expect(mockGetTimeSlotByIdService.execute).toHaveBeenCalledWith(
        id,
        user.schoolUnitId,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should delegate to CreateTimeSlotUseCase with dto and schoolUnitId', async () => {
      const dto: CreateTimeSlotDto = {
        name: 'Jam ke-1',
        startTime: '07:00',
        endTime: '07:30',
        order: 1,
        typeId: 'type-1',
      };
      const expected = { id: 'ts-new', ...dto };
      mockCreateTimeSlotService.execute.mockResolvedValue(expected);

      const result = await controller.create(dto, user);

      expect(mockCreateTimeSlotService.execute).toHaveBeenCalledWith(
        dto,
        user.schoolUnitId,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateTimeSlotUseCase with id, dto, and schoolUnitId', async () => {
      const id = 'ts-1';
      const dto: UpdateTimeSlotDto = { startTime: '07:15' };
      const expected = { id: 'ts-1', startTime: '07:15' };
      mockUpdateTimeSlotService.execute.mockResolvedValue(expected);

      const result = await controller.update(id, dto, user);

      expect(mockUpdateTimeSlotService.execute).toHaveBeenCalledWith(
        id,
        dto,
        user.schoolUnitId,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should delegate to DeleteTimeSlotUseCase with id and schoolUnitId', async () => {
      const id = 'ts-1';
      mockDeleteTimeSlotService.execute.mockResolvedValue(undefined);

      await controller.remove(id, user);

      expect(mockDeleteTimeSlotService.execute).toHaveBeenCalledWith(
        id,
        user.schoolUnitId,
      );
    });
  });
});
