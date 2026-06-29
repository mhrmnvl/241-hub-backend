import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { EnrollmentStatus } from '@prisma/client';
import { SemestersRepository } from '../../semesters/index.js';
import { EnrollmentsRepository } from '../../enrollments/index.js';
import { CreateStudentDto } from '../dto/create-student.dto.js';
import { StudentResponseDto } from '../dto/student-response.dto.js';
import { StudentsRepository } from '../repositories/students.repository.js';

@Injectable()
export class CreateStudentUseCase {
  private readonly logger = new Logger(CreateStudentUseCase.name);

  constructor(
    private readonly repo: StudentsRepository,
    private readonly enrollmentRepo: EnrollmentsRepository,
    private readonly semesterRepo: SemestersRepository,
  ) {}

  async execute(
    dto: CreateStudentDto,
    organizationId: string,
    schoolUnitId: string | null,
  ): Promise<StudentResponseDto> {
    dto.identifier ??= dto.nis;
    dto.password ??= dto.nis;

    const [dupNis, dupNisn] = await Promise.all([
      this.repo.findByNis(dto.nis),
      this.repo.findByNisn(dto.nisn),
    ]);
    if (dupNis)
      throw new ConflictException(`NIS "${dto.nis}" is already registered`);
    if (dupNisn)
      throw new ConflictException(`NISN "${dto.nisn}" is already registered`);

    const userWithStudent = await this.repo.create(
      dto,
      organizationId,
      schoolUnitId,
    );
    const student = userWithStudent.student;
    if (!student) {
      throw new Error('Student creation failed');
    }

    if (dto.classroomId) {
      const activeSemester = await this.semesterRepo.findActive();
      if (activeSemester) {
        await this.enrollmentRepo.create({
          studentId: student.id,
          classroomId: dto.classroomId,
          semesterId: activeSemester.id,
          status: EnrollmentStatus.ACTIVE,
        });
        this.logger.log(
          `Auto-enrolled student ${dto.nis} to classroom ${dto.classroomId}`,
        );
      }
    }

    this.logger.log(`Student created: ${dto.nis}`);
    return {
      id: student.id,
      userId: student.userId,
      nis: student.nis,
      nisn: student.nisn,
      status: student.status,
      gradeId: student.gradeId ?? undefined,
    };
  }
}
