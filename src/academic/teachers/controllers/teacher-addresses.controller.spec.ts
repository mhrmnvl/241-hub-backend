import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../../../shared/dto/address.dto.js';
import { TeacherAddressUseCase } from '../use-cases/teacher-address.use-case.js';
import { TeacherAddressesController } from './teacher-addresses.controller.js';

describe('TeacherAddressesController', () => {
  let controller: TeacherAddressesController;

  const mockAddressUseCase = {
    findAll: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherAddressesController],
      providers: [
        { provide: TeacherAddressUseCase, useValue: mockAddressUseCase },
      ],
    }).compile();

    controller = module.get<TeacherAddressesController>(
      TeacherAddressesController,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to TeacherAddressUseCase.findAll with teacherId', async () => {
      const id = 'emp-1';
      const expected = [{ id: 'addr-1', street: 'Jl. Veteran No. 1' }];
      mockAddressUseCase.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(id);

      expect(mockAddressUseCase.findAll).toHaveBeenCalledWith(id);
      expect(result).toEqual(expected);
    });
  });

  describe('add', () => {
    it('should delegate to TeacherAddressUseCase.add with teacherId and dto', async () => {
      const id = 'emp-1';
      const dto: CreateAddressDto = {
        street: 'Jl. Veteran No. 1',
        rt: '001',
        rw: '002',
        village: 'Penanggungan',
        district: 'Klojen',
        city: 'Kota Malang',
        province: 'Jawa Timur',
        postalCode: '65113',
      };
      const expected = { id: 'addr-new', ...dto };
      mockAddressUseCase.add.mockResolvedValue(expected);

      const result = await controller.add(id, dto);

      expect(mockAddressUseCase.add).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should delegate to TeacherAddressUseCase.update with ids and dto', async () => {
      const id = 'emp-1';
      const addressId = 'addr-1';
      const dto: UpdateAddressDto = { street: 'Jl. Soekarno Hatta No. 5' };
      const expected = { id: 'addr-1', street: 'Jl. Soekarno Hatta No. 5' };
      mockAddressUseCase.update.mockResolvedValue(expected);

      const result = await controller.update(id, addressId, dto);

      expect(mockAddressUseCase.update).toHaveBeenCalledWith(
        id,
        addressId,
        dto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should delegate to TeacherAddressUseCase.remove with ids', async () => {
      const id = 'emp-1';
      const addressId = 'addr-1';
      mockAddressUseCase.remove.mockResolvedValue(undefined);

      await controller.remove(id, addressId);

      expect(mockAddressUseCase.remove).toHaveBeenCalledWith(id, addressId);
    });
  });
});
