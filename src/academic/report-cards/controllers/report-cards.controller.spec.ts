import { Test, TestingModule } from '@nestjs/testing';
import { DeleteReportCardUseCase } from '../use-cases/delete-report-card.use-case.js';
import { GenerateReportCardUseCase } from '../use-cases/generate-report-card.use-case.js';
import { GetReportCardByIdUseCase } from '../use-cases/get-report-card-by-id.use-case.js';
import { GetReportCardsUseCase } from '../use-cases/get-report-cards.use-case.js';
import { PublishReportCardUseCase } from '../use-cases/publish-report-card.use-case.js';
import { UpdateReportCardUseCase } from '../use-cases/update-report-card.use-case.js';
import { ReportCardsController } from './report-cards.controller.js';

describe('ReportCardsController', () => {
  let controller: ReportCardsController;

  const mockGetReportCards = { execute: jest.fn() };
  const mockGetReportCardById = { execute: jest.fn() };
  const mockGenerate = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockPublish = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportCardsController],
      providers: [
        { provide: GetReportCardsUseCase, useValue: mockGetReportCards },
        { provide: GetReportCardByIdUseCase, useValue: mockGetReportCardById },
        { provide: GenerateReportCardUseCase, useValue: mockGenerate },
        { provide: UpdateReportCardUseCase, useValue: mockUpdate },
        { provide: PublishReportCardUseCase, useValue: mockPublish },
        { provide: DeleteReportCardUseCase, useValue: mockDelete },
      ],
    }).compile();

    controller = module.get<ReportCardsController>(ReportCardsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to GetReportCardsUseCase', async () => {
      const query = { page: 1, limit: 10 };
      mockGetReportCards.execute.mockResolvedValue({ data: [] });

      await controller.findAll(query);

      expect(mockGetReportCards.execute).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should delegate to GetReportCardByIdUseCase', async () => {
      mockGetReportCardById.execute.mockResolvedValue({ id: 'rap-1' });

      const result = await controller.findOne('rap-1');

      expect(mockGetReportCardById.execute).toHaveBeenCalledWith('rap-1');
      expect(result).toEqual({ id: 'rap-1' });
    });
  });

  describe('generate', () => {
    it('should delegate to GenerateReportCardUseCase', async () => {
      const dto = { enrollmentId: 'enr-1' };
      mockGenerate.execute.mockResolvedValue({ id: 'rap-new' });

      await controller.generate(dto);

      expect(mockGenerate.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateReportCardUseCase', async () => {
      const dto = { teacherNote: 'Good' };
      mockUpdate.execute.mockResolvedValue({ id: 'rap-1' });

      await controller.update('rap-1', dto);

      expect(mockUpdate.execute).toHaveBeenCalledWith('rap-1', dto);
    });
  });

  describe('publish', () => {
    it('should delegate to PublishReportCardUseCase', async () => {
      mockPublish.execute.mockResolvedValue({ id: 'rap-1', isPublished: true });

      await controller.publish('rap-1');

      expect(mockPublish.execute).toHaveBeenCalledWith('rap-1');
    });
  });

  describe('remove', () => {
    it('should delegate to DeleteReportCardUseCase', async () => {
      mockDelete.execute.mockResolvedValue(undefined);

      await controller.remove('rap-1');

      expect(mockDelete.execute).toHaveBeenCalledWith('rap-1');
    });
  });
});
