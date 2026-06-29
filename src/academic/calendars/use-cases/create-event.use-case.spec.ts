import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsRepository } from '../../classrooms/index.js';
import { CreateEventDto } from '../dto/create-event.dto.js';
import { EventsRepository } from '../repositories/events.repository.js';
import { CreateEventUseCase } from './create-event.use-case.js';

describe('CreateEventUseCase', () => {
  let useCase: CreateEventUseCase;

  const mockRepository = {
    create: jest.fn(),
  };

  const mockClassroomRepo = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEventUseCase,
        { provide: EventsRepository, useValue: mockRepository },
        { provide: ClassroomsRepository, useValue: mockClassroomRepo },
      ],
    }).compile();

    useCase = module.get<CreateEventUseCase>(CreateEventUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const mockEvent = {
      id: 'evt-1',
      title: 'Pekan Ilmiah Siswa',
      description: 'Kegiatan pameran karya ilmiah siswa.',
      startTime: '2024-03-05T08:00:00Z',
      endTime: '2024-03-05T10:00:00Z',
    };

    const schoolUnitId = 'school-1';

    it('should create a school-wide event (no classroomIds) successfully', async () => {
      const dto: CreateEventDto = {
        title: 'Pekan Ilmiah Siswa',
        description: 'Kegiatan pameran karya ilmiah siswa.',
        startTime: '2024-03-05T08:00:00Z',
        endTime: '2024-03-05T10:00:00Z',
      };
      mockRepository.create.mockResolvedValue(mockEvent);

      const result = await useCase.execute(dto, schoolUnitId);

      expect(mockClassroomRepo.findById).not.toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith(dto, schoolUnitId);
      expect(result).toEqual(mockEvent);
    });

    it('should create a classroom-specific event after validating each classroom', async () => {
      const dto: CreateEventDto = {
        title: 'Pekan Ilmiah Siswa',
        description: 'Kegiatan pameran karya ilmiah siswa.',
        startTime: '2024-03-05T08:00:00Z',
        endTime: '2024-03-05T10:00:00Z',
        classroomIds: ['cls-1', 'cls-2'],
      };
      mockClassroomRepo.findById.mockResolvedValue({ id: 'cls-1' });
      mockRepository.create.mockResolvedValue({
        ...mockEvent,
        classrooms: dto.classroomIds,
      });

      const result = await useCase.execute(dto, schoolUnitId);

      expect(mockClassroomRepo.findById).toHaveBeenCalledWith('cls-1');
      expect(mockClassroomRepo.findById).toHaveBeenCalledWith('cls-2');
      expect(mockRepository.create).toHaveBeenCalledWith(dto, schoolUnitId);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when a target classroom does not exist', async () => {
      const dto: CreateEventDto = {
        title: 'Pekan Ilmiah Siswa',
        description: 'Kegiatan pameran karya ilmiah siswa.',
        startTime: '2024-03-05T08:00:00Z',
        endTime: '2024-03-05T10:00:00Z',
        classroomIds: ['cls-nonexistent'],
      };
      mockClassroomRepo.findById.mockResolvedValue(null);

      await expect(useCase.execute(dto, schoolUnitId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should NOT call findClassroomById when classroomIds is empty array', async () => {
      const dto: CreateEventDto = {
        title: 'Pekan Ilmiah Siswa',
        description: 'Kegiatan pameran karya ilmiah siswa.',
        startTime: '2024-03-05T08:00:00Z',
        endTime: '2024-03-05T10:00:00Z',
        classroomIds: [],
      };
      mockRepository.create.mockResolvedValue(mockEvent);

      await useCase.execute(dto, schoolUnitId);

      expect(mockClassroomRepo.findById).not.toHaveBeenCalled();
    });
  });
});
