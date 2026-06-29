import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfileDto } from '../../../platform/profiles/index.js';
import { UpdateStudentProfileUseCase } from '../use-cases/update-student-profile.use-case.js';
import { StudentProfilesController } from './student-profiles.controller.js';

describe('StudentProfilesController', () => {
  let controller: StudentProfilesController;

  const mockUpdateStudentProfileService = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentProfilesController],
      providers: [
        {
          provide: UpdateStudentProfileUseCase,
          useValue: mockUpdateStudentProfileService,
        },
      ],
    }).compile();

    controller = module.get<StudentProfilesController>(
      StudentProfilesController,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should delegate to UpdateStudentProfileUseCase with id and dto', async () => {
      const id = 'stu-1';
      const dto: UpdateProfileDto = { name: 'Ahmad Updated' };
      const expected = { id: 'prof-1', name: 'Ahmad Updated' };
      mockUpdateStudentProfileService.execute.mockResolvedValue(expected);

      const result = await controller.updateProfile(id, dto);

      expect(mockUpdateStudentProfileService.execute).toHaveBeenCalledWith(
        id,
        dto,
      );
      expect(result).toEqual(expected);
    });
  });
});
