import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsRepository } from '../repositories/events.repository.js';
import { GetEventByIdUseCase } from './get-event-by-id.use-case.js';

describe('GetEventByIdUseCase', () => {
  let useCase: GetEventByIdUseCase;

  const mockRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEventByIdUseCase,
        { provide: EventsRepository, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetEventByIdUseCase>(GetEventByIdUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const id = 'evt-1';
    const schoolUnitId = 'school-1';

    it('should return an event when found', async () => {
      const mockEvent = {
        id: 'evt-1',
        title: 'Pekan Ilmiah Siswa',
        startTime: '2024-03-05T08:00:00Z',
        endTime: '2024-03-05T10:00:00Z',
      };
      mockRepository.findById.mockResolvedValue(mockEvent);

      const result = await useCase.execute(id, schoolUnitId);

      expect(mockRepository.findById).toHaveBeenCalledWith(id, schoolUnitId);
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException when event is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(id, schoolUnitId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
