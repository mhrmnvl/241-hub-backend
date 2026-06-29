import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../../../shared/dto/address.dto.js';
import { AddStudentAddressUseCase } from '../use-cases/add-student-address.use-case.js';
import { GetStudentAddressesUseCase } from '../use-cases/get-student-addresses.use-case.js';
import { RemoveStudentAddressUseCase } from '../use-cases/remove-student-address.use-case.js';
import { UpdateStudentAddressUseCase } from '../use-cases/update-student-address.use-case.js';
import { StudentAddressesController } from './student-addresses.controller.js';

describe('StudentAddressesController', () => {
  let controller: StudentAddressesController;

  const mockGetStudentAddressesService = { execute: jest.fn() };
  const mockAddStudentAddressService = { execute: jest.fn() };
  const mockUpdateStudentAddressService = { execute: jest.fn() };
  const mockRemoveStudentAddressService = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAddressesController],
      providers: [
        {
          provide: GetStudentAddressesUseCase,
          useValue: mockGetStudentAddressesService,
        },
        {
          provide: AddStudentAddressUseCase,
          useValue: mockAddStudentAddressService,
        },
        {
          provide: UpdateStudentAddressUseCase,
          useValue: mockUpdateStudentAddressService,
        },
        {
          provide: RemoveStudentAddressUseCase,
          useValue: mockRemoveStudentAddressService,
        },
      ],
    }).compile();

    controller = module.get<StudentAddressesController>(
      StudentAddressesController,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const createDto: CreateAddressDto = {
    street: 'Jl. Veteran No. 1',
    rt: '001',
    rw: '002',
    village: 'Penanggungan',
    district: 'Klojen',
    city: 'Kota Malang',
    province: 'Jawa Timur',
    postalCode: '65113',
  };

  describe('findAll', () => {
    it('should delegate to GetStudentAddressesUseCase with id and user', async () => {
      const id = 'stu-1';
      const user = { id: 'user-1' };
      const expected = [{ id: 'addr-1' }];
      mockGetStudentAddressesService.execute.mockResolvedValue(expected);

      const result = await controller.findAll(id, user);

      expect(mockGetStudentAddressesService.execute).toHaveBeenCalledWith(
        id,
        user,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('addAddress', () => {
    it('should delegate to AddStudentAddressUseCase with id and dto', async () => {
      const id = 'stu-1';
      const expected = { id: 'addr-new', ...createDto };
      mockAddStudentAddressService.execute.mockResolvedValue(expected);

      const result = await controller.addAddress(id, createDto);

      expect(mockAddStudentAddressService.execute).toHaveBeenCalledWith(
        id,
        createDto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('updateAddress', () => {
    it('should delegate to UpdateStudentAddressUseCase with id, addressId and dto', async () => {
      const id = 'stu-1';
      const addressId = 'addr-1';
      const dto: UpdateAddressDto = { city: 'Surabaya' };
      const expected = { id: 'addr-1', city: 'Surabaya' };
      mockUpdateStudentAddressService.execute.mockResolvedValue(expected);

      const result = await controller.updateAddress(id, addressId, dto);

      expect(mockUpdateStudentAddressService.execute).toHaveBeenCalledWith(
        id,
        addressId,
        dto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('removeAddress', () => {
    it('should delegate to RemoveStudentAddressUseCase with id and addressId', async () => {
      const id = 'stu-1';
      const addressId = 'addr-1';
      mockRemoveStudentAddressService.execute.mockResolvedValue(undefined);

      await controller.removeAddress(id, addressId);

      expect(mockRemoveStudentAddressService.execute).toHaveBeenCalledWith(
        id,
        addressId,
      );
    });
  });
});
