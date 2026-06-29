import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ExcelJS from 'exceljs';
import { ClassroomLevelsRepository } from '../../grades/index.js';
import { ClassroomsRepository } from '../../classrooms/index.js';
import { SemestersRepository } from '../../semesters/index.js';
import { EnrollmentsRepository } from '../../enrollments/index.js';
import {
  BulkImportRowResultDto,
  BulkImportStudentsResponseDto,
} from '../dto/bulk-import-student-response.dto.js';
import { BulkImportStudentRowDto } from '../dto/bulk-import-student.dto.js';
import { CreateStudentDto } from '../dto/create-student.dto.js';
import { StudentsRepository } from '../repositories/students.repository.js';

type ExcelRow = Record<string, ExcelJS.CellValue>;
type MappedRow = Record<string, string | number | undefined>;

@Injectable()
export class BulkImportStudentsUseCase {
  constructor(
    private readonly repo: StudentsRepository,
    private readonly classroomRepo: ClassroomsRepository,
    private readonly gradeRepo: ClassroomLevelsRepository,
    private readonly enrollmentRepo: EnrollmentsRepository,
    private readonly semesterRepo: SemestersRepository,
  ) {}

  async execute(
    buffer: Buffer,
    organizationId: string,
    schoolUnitId: string | null,
  ): Promise<BulkImportStudentsResponseDto> {
    const rows = await this.parseExcel(buffer);

    if (rows.length === 0) {
      throw new BadRequestException(
        'Excel file is empty or has no valid data rows',
      );
    }

    const activeSemester = await this.semesterRepo.findActive();
    const results: BulkImportRowResultDto[] = [];

    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 2;
      const rawRow: MappedRow = this.mapColumns(rows[i]);

      const dto = plainToInstance(BulkImportStudentRowDto, rawRow);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: false,
      });

      if (errors.length > 0) {
        const messages = errors
          .map((e) => Object.values(e.constraints ?? {}).join(', '))
          .join('; ');

        results.push({
          row: rowNumber,
          status: 'FAILED',
          identifier: rawRow.identifier as string,
          error: `Validation failed: ${messages}`,
        });
        continue;
      }

      try {
        let resolvedClassroomLevelId: string | undefined;
        if (dto.grade) {
          const level = await this.gradeRepo.findByLevel(dto.grade);
          if (!level) {
            results.push({
              row: rowNumber,
              status: 'FAILED',
              identifier: dto.identifier,
              error: `Tingkat ${dto.grade} tidak ditemukan`,
            });
            continue;
          }
          resolvedClassroomLevelId = level.id;
        }

        let resolvedClassroomId: string | undefined;
        if (dto.classroomCode) {
          const classroom = await this.classroomRepo.findByCode(
            dto.classroomCode,
          );
          if (!classroom) {
            results.push({
              row: rowNumber,
              status: 'FAILED',
              identifier: dto.identifier,
              error: `Kelas dengan kode "${dto.classroomCode}" tidak ditemukan`,
            });
            continue;
          }
          resolvedClassroomId = classroom.id;
        }

        const [dupNis, dupNisn] = await Promise.all([
          this.repo.findByNis(dto.nis),
          this.repo.findByNisn(dto.nisn),
        ]);

        if (dupNis) {
          results.push({
            row: rowNumber,
            status: 'FAILED',
            identifier: dto.identifier,
            error: `NIS "${dto.nis}" is already registered`,
          });
          continue;
        }

        if (dupNisn) {
          results.push({
            row: rowNumber,
            status: 'FAILED',
            identifier: dto.identifier,
            error: `NISN "${dto.nisn}" is already registered`,
          });
          continue;
        }

        const createDto: CreateStudentDto = {
          identifier: dto.identifier,
          password: dto.password,
          name: dto.name,
          nik: dto.nik,
          gender: dto.gender,
          birthPlace: dto.birthPlace,
          birthDate: dto.birthDate,
          email: dto.email,
          phone: dto.phone,
          gradeId: resolvedClassroomLevelId,
          nis: dto.nis,
          nisn: dto.nisn,
        };

        const userWithStudent = await this.repo.create(
          createDto,
          organizationId,
          schoolUnitId,
        );
        const student = userWithStudent.student;
        if (!student) {
          throw new Error('Student creation failed');
        }

        if (resolvedClassroomId && activeSemester) {
          await this.enrollmentRepo.create({
            studentId: student.id,
            classroomId: resolvedClassroomId,
            semesterId: activeSemester.id,
            status: EnrollmentStatus.ACTIVE,
          });
        }

        results.push({
          row: rowNumber,
          status: 'SUCCESS',
          identifier: dto.identifier,
        });
      } catch {
        results.push({
          row: rowNumber,
          status: 'FAILED',
          identifier: dto.identifier,
          error: 'Unexpected error during import',
        });
      }
    }

    const success = results.filter((r) => r.status === 'SUCCESS').length;
    const failed = results.filter((r) => r.status === 'FAILED').length;

    return { total: results.length, success, failed, results };
  }
  private mapColumns(row: ExcelRow): MappedRow {
    const pick = (...keys: string[]): ExcelJS.CellValue =>
      keys.reduce<ExcelJS.CellValue>((val, k) => val ?? row[k], undefined);

    const str = (...keys: string[]): string => {
      const v = pick(...keys);
      if (typeof v === 'string') return v.trim();
      if (typeof v === 'number') return String(v).trim();
      return '';
    };

    const rawGender = str('Jenis Kelamin', 'Gender', 'gender').toUpperCase();
    const gender =
      rawGender === 'L'
        ? 'MALE'
        : rawGender === 'P'
          ? 'FEMALE'
          : rawGender || undefined;

    const rawLevel = pick('Tingkat', 'Level', 'grade');
    const grade =
      typeof rawLevel === 'number'
        ? rawLevel
        : typeof rawLevel === 'string' && rawLevel.trim()
          ? Number(rawLevel.trim()) || undefined
          : undefined;

    const classroomCode =
      str(
        'Kelas',
        'Classroom Code',
        'classroomCode',
        'Rombel',
        'Rombongan Belajar',
      ) || undefined;

    const nis = str('NIS', 'nis');
    const identifier = str('Identifier', 'identifier', 'Username', 'username') || nis;
    const password = str('Password', 'password') || nis;

    return {
      identifier,
      password,
      name: str('Nama', 'Name', 'name'),
      nik: str('NIK', 'nik'),
      gender,
      birthPlace: str('Tempat Lahir', 'Birth Place', 'birthPlace'),
      birthDate: str('Tanggal Lahir', 'Birth Date', 'birthDate'),
      email: str('Email', 'email') || undefined,
      phone: str('Telepon', 'Phone', 'phone') || undefined,
      grade,
      classroomCode,
      nis,
      nisn: str('NISN', 'nisn'),
    };
  }

  private async parseExcel(buffer: Buffer): Promise<ExcelRow[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(new Uint8Array(buffer).buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet || worksheet.rowCount < 2) {
      return [];
    }

    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = cell.text;
    });

    const rows: ExcelRow[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const record: ExcelRow = {};
      let hasValue = false;
      row.eachCell((cell, colNumber) => {
        const key = headers[colNumber];
        if (key) {
          record[key] = cell.value;
          hasValue = true;
        }
      });
      if (hasValue) {
        rows.push(record);
      }
    });

    return rows;
  }
  async buildImportTemplate(): Promise<Buffer> {
    const headers = [
      {
        NIS: '',
        NISN: '',
        Nama: '',
        NIK: '',
        'Jenis Kelamin': 'L | P',
        'Tempat Lahir': '',
        'Tanggal Lahir': 'YYYY-MM-DD',
        Email: '',
        Telepon: '',
        Tingkat: '7 | 8 | 9',
        Kelas: '(opsional) VIII-A | IX-B',
        Username: '',
        Password: '',
      },
    ];
    return this.buildExcel(headers, 'Template Import Siswa');
  }

  private async buildExcel(
    rows: ExcelRow[],
    sheetName: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (rows.length > 0) {
      const keys = Object.keys(rows[0]);
      worksheet.columns = keys.map((key) => ({
        header: key,
        key,
        width: 20,
      }));
      worksheet.addRows(rows);
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
