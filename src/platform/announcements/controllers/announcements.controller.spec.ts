import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementQueryDto } from '../dto/announcement-query.dto.js';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto.js';
import { CreateAnnouncementUseCase } from '../use-cases/create-announcement.use-case.js';
import { DeleteAnnouncementUseCase } from '../use-cases/delete-announcement.use-case.js';
import { GetAnnouncementByIdUseCase } from '../use-cases/get-announcement-by-id.use-case.js';
import { GetAnnouncementsUseCase } from '../use-cases/get-announcements.use-case.js';
import { UpdateAnnouncementUseCase } from '../use-cases/update-announcement.use-case.js';
import { AnnouncementsController } from './announcements.controller.js';

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;

  const mockGetAnnouncementsService = { execute: jest.fn() };
  const mockGetAnnouncementByIdService = { execute: jest.fn() };
  const mockCreateAnnouncementService = { execute: jest.fn() };
  const mockUpdateAnnouncementService = { execute: jest.fn() };
  const mockDeleteAnnouncementService = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        {
          provide: GetAnnouncementsUseCase,
          useValue: mockGetAnnouncementsService,
        },
        {
          provide: GetAnnouncementByIdUseCase,
          useValue: mockGetAnnouncementByIdService,
        },
        {
          provide: CreateAnnouncementUseCase,
          useValue: mockCreateAnnouncementService,
        },
        {
          provide: UpdateAnnouncementUseCase,
          useValue: mockUpdateAnnouncementService,
        },
        {
          provide: DeleteAnnouncementUseCase,
          useValue: mockDeleteAnnouncementService,
        },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to GetAnnouncementsUseCase with query', async () => {
      const query: AnnouncementQueryDto = { page: 1, limit: 10 };
      const expected = {
        data: [{ id: 'ann-1', title: 'Jadwal Ujian', classrooms: [] }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockGetAnnouncementsService.execute.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(mockGetAnnouncementsService.execute).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate to GetAnnouncementByIdUseCase with id', async () => {
      const id = 'ann-1';
      const expected = { id: 'ann-1', title: 'Jadwal Ujian', classrooms: [] };
      mockGetAnnouncementByIdService.execute.mockResolvedValue(expected);

      const result = await controller.findOne(id);

      expect(mockGetAnnouncementByIdService.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should delegate to CreateAnnouncementUseCase with dto', async () => {
      const dto: CreateAnnouncementDto = {
        title: 'Jadwal Ujian Akhir Semester',
        description:
          'Ujian akhir semester genap dilaksanakan pada tanggal 20-25 Mei 2025.',
        date: '2025-05-20',
      };
      const expected = { id: 'ann-new', ...dto };
      mockCreateAnnouncementService.execute.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(mockCreateAnnouncementService.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateAnnouncementUseCase with id and dto', async () => {
      const id = 'ann-1';
      const dto: UpdateAnnouncementDto = { title: 'Updated Announcement' };
      const expected = { id: 'ann-1', title: 'Updated Announcement' };
      mockUpdateAnnouncementService.execute.mockResolvedValue(expected);

      const result = await controller.update(id, dto);

      expect(mockUpdateAnnouncementService.execute).toHaveBeenCalledWith(
        id,
        dto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should delegate to DeleteAnnouncementUseCase with id', async () => {
      const id = 'ann-1';
      mockDeleteAnnouncementService.execute.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockDeleteAnnouncementService.execute).toHaveBeenCalledWith(id);
    });
  });
});
