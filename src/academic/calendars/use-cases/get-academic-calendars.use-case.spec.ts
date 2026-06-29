import { Test, TestingModule } from '@nestjs/testing';
import { AcademicCalendarType } from '@prisma/client';
import { AcademicCalendarQueryDto } from '../dto/academic-calendar-query.dto.js';
import { AcademicCalendarsRepository } from '../repositories/academic-calendars.repository.js';
import { GetAcademicCalendarsUseCase } from './get-academic-calendars.use-case.js';

describe('GetAcademicCalendarsUseCase', () => {
  let useCase: GetAcademicCalendarsUseCase;

  const mockRepo = { findAll: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAcademicCalendarsUseCase,
        { provide: AcademicCalendarsRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<GetAcademicCalendarsUseCase>(
      GetAcademicCalendarsUseCase,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated calendars', async () => {
      const query: AcademicCalendarQueryDto = {
        academicYearId: 'ay-uuid',
        page: 1,
        limit: 50,
      };
      const expected = {
        data: [{ id: 'cal-1' }],
        total: 1,
        page: 1,
        limit: 50,
      };
      mockRepo.findAll.mockResolvedValue(expected);

      const result = await useCase.execute(query);

      expect(mockRepo.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should pass type enum filter', async () => {
      const query: AcademicCalendarQueryDto = {
        type: AcademicCalendarType.HOLIDAY_NATIONAL,
      };
      mockRepo.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 50,
      });

      await useCase.execute(query);

      expect(mockRepo.findAll).toHaveBeenCalledWith(query);
    });
  });
});
