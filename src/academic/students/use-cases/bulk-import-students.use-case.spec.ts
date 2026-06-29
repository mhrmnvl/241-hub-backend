import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import ExcelJS from 'exceljs';
import { ClassroomLevelsRepository } from '../../grades/index.js';
import { ClassroomsRepository } from '../../classrooms/index.js';
import { SemestersRepository } from '../../semesters/index.js';
import { EnrollmentsRepository } from '../../enrollments/index.js';
import { StudentsRepository } from '../repositories/students.repository.js';
import { BulkImportStudentsUseCase } from './bulk-import-students.use-case.js';

async function makeExcelBuffer(
  rows: Record<string, ExcelJS.CellValue>[],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  if (rows.length > 0) {
    const keys = Object.keys(rows[0]);
    worksheet.columns = keys.map((key) => ({ header: key, key, width: 20 }));
    worksheet.addRows(rows);
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
const validRow = {
  NIS: '2024001',
  NISN: '0012345678',
  Nama: 'Ahmad Fauzi',
  NIK: '3578010101080001',
  'Jenis Kelamin': 'L',
  'Tempat Lahir': 'Malang',
  'Tanggal Lahir': '2008-01-01',
  Email: 'ahmad@test.com',
  Telepon: '081234567890',
  Kelas: 'VII-A',
  Username: 'siswa001',
  Password: 'P@ssw0rd!',
};

describe('BulkImportStudentsUseCase', () => {
  let useCase: BulkImportStudentsUseCase;

  const mockStudentRepo = {
    findByNis: jest.fn(),
    findByNisn: jest.fn(),
    create: jest.fn(),
  };

  const mockClassroomRepo = {
    findByCode: jest.fn(),
  };

  const mockClassroomLevelRepo = {
    findByLevel: jest.fn(),
  };

  const mockEnrollmentRepo = {
    create: jest.fn(),
  };

  const mockSemesterRepo = {
    findActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BulkImportStudentsUseCase,
        { provide: StudentsRepository, useValue: mockStudentRepo },
        { provide: ClassroomsRepository, useValue: mockClassroomRepo },
        {
          provide: ClassroomLevelsRepository,
          useValue: mockClassroomLevelRepo,
        },
        { provide: EnrollmentsRepository, useValue: mockEnrollmentRepo },
        { provide: SemestersRepository, useValue: mockSemesterRepo },
      ],
    }).compile();

    useCase = module.get<BulkImportStudentsUseCase>(BulkImportStudentsUseCase);
    jest.clearAllMocks();
    mockSemesterRepo.findActive.mockResolvedValue({ id: 'sem-active' });
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw BadRequestException when file is empty', async () => {
      const emptyBuffer = await makeExcelBuffer([]);

      await expect(
        useCase.execute(emptyBuffer, 'org-1', 'unit-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should import a valid row with classroom code successfully', async () => {
      mockClassroomRepo.findByCode.mockResolvedValue({
        id: 'cls-1',
        code: 'VII-A',
        gradeId: 'lvl-7',
      });
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue(null);
      mockStudentRepo.create.mockResolvedValue({ student: { id: 'stu-1' } });

      const buffer = await makeExcelBuffer([validRow]);
      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.total).toBe(1);
      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.results[0].status).toBe('SUCCESS');
      expect(mockClassroomRepo.findByCode).toHaveBeenCalledWith('VII-A');
    });

    it('should import a PPDB student without classroom code', async () => {
      const ppdbRow = { ...validRow, Kelas: '' };
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue(null);
      mockStudentRepo.create.mockResolvedValue({ student: { id: 'stu-2' } });

      const buffer = await makeExcelBuffer([ppdbRow]);
      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.success).toBe(1);
      expect(mockClassroomRepo.findByCode).not.toHaveBeenCalled();
    });

    it('should fail row when classroom code is not found', async () => {
      mockClassroomRepo.findByCode.mockResolvedValue(null);

      const buffer = await makeExcelBuffer([validRow]);
      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.failed).toBe(1);
      expect(result.results[0].status).toBe('FAILED');
      expect(result.results[0].error).toContain('tidak ditemukan');
    });

    it('should fail row when NIS is duplicated', async () => {
      mockClassroomRepo.findByCode.mockResolvedValue({
        id: 'cls-1',
        code: 'VII-A',
        gradeId: 'lvl-7',
      });
      mockStudentRepo.findByNis.mockResolvedValue({ id: 'stu-existing' });
      mockStudentRepo.findByNisn.mockResolvedValue(null);

      const buffer = await makeExcelBuffer([validRow]);
      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.failed).toBe(1);
      expect(result.results[0].error).toContain('NIS');
    });

    it('should fail row when NISN is duplicated', async () => {
      mockClassroomRepo.findByCode.mockResolvedValue({
        id: 'cls-1',
        code: 'VII-A',
        gradeId: 'lvl-7',
      });
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue({ id: 'stu-existing' });

      const buffer = await makeExcelBuffer([validRow]);
      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.failed).toBe(1);
      expect(result.results[0].error).toContain('NISN');
    });

    it('should fail row when validation fails (missing required field)', async () => {
      const invalidRow = { ...validRow, Nama: '' };
      const buffer = await makeExcelBuffer([invalidRow]);

      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.failed).toBe(1);
      expect(result.results[0].error).toContain('Validation failed');
      expect(mockStudentRepo.create).not.toHaveBeenCalled();
    });

    it('should correctly number rows starting at 2 (row 1 = header)', async () => {
      const ppdbRow = { ...validRow, Kelas: '' };
      mockStudentRepo.findByNis.mockResolvedValue(null);
      mockStudentRepo.findByNisn.mockResolvedValue(null);
      mockStudentRepo.create.mockResolvedValue({ student: { id: 'stu-1' } });

      const buffer = await makeExcelBuffer([ppdbRow]);
      const result = await useCase.execute(buffer, 'org-1', 'unit-1');

      expect(result.results[0].row).toBe(2);
    });
  });
});
