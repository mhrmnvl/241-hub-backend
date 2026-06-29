import { Test, TestingModule } from '@nestjs/testing';
import { GetDashboardSummaryService } from '../services/get-dashboard-summary.service.js';
import { DashboardsController } from './dashboards.controller.js';

describe('DashboardsController', () => {
  let controller: DashboardsController;

  const mockGetSummary = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardsController],
      providers: [
        { provide: GetDashboardSummaryService, useValue: mockGetSummary },
      ],
    }).compile();

    controller = module.get<DashboardsController>(DashboardsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('should delegate to GetDashboardSummaryService', async () => {
      const summary = { totalStudents: 100, totalTeachers: 20 };
      mockGetSummary.execute.mockResolvedValue(summary);

      const result = await controller.getSummary();

      expect(mockGetSummary.execute).toHaveBeenCalled();
      expect(result).toEqual(summary);
    });
  });
});
