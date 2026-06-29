import { Test, TestingModule } from '@nestjs/testing';
import { EventQueryDto } from '../dto/event-query.dto.js';
import { EventsRepository } from '../repositories/events.repository.js';
import { GetEventsUseCase } from './get-events.use-case.js';

describe('GetEventsUseCase', () => {
  let useCase: GetEventsUseCase;

  const mockRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEventsUseCase,
        { provide: EventsRepository, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetEventsUseCase>(GetEventsUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const query: EventQueryDto = { page: 1, limit: 10 };
    const schoolUnitId = 'school-1';

    it('should return paginated events with correct meta', async () => {
      const mockData = [
        { id: 'evt-1', title: 'Pekan Ilmiah Siswa' },
        { id: 'evt-2', title: 'Hari Olahraga Sekolah' },
      ];
      mockRepository.findAll.mockResolvedValue({
        data: mockData,
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await useCase.execute(query, schoolUnitId);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query, schoolUnitId);
      expect(result).toEqual({
        data: mockData,
        meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
      });
    });

    it('should calculate totalPages correctly', async () => {
      mockRepository.findAll.mockResolvedValue({
        data: [],
        total: 25,
        page: 1,
        limit: 10,
      });

      const result = await useCase.execute(query, schoolUnitId);

      expect(result.meta.totalPages).toBe(3);
    });

    it('should return empty data when no events exist', async () => {
      mockRepository.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      const result = await useCase.execute(query, schoolUnitId);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });

    it('should forward search and classroomId filters to repository', async () => {
      const searchQuery: EventQueryDto = {
        page: 1,
        limit: 10,
        search: 'Pekan',
        classroomId: 'cls-1',
      };
      mockRepository.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await useCase.execute(searchQuery, schoolUnitId);

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        searchQuery,
        schoolUnitId,
      );
    });
  });
});
