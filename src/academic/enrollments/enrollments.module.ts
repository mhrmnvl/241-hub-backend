import { Module } from '@nestjs/common';
import { EnrollmentsController } from './controllers/enrollments.controller.js';
import { EnrollmentsRepository } from './repositories/enrollments.repository.js';
import { BulkCreateStudentEnrollmentUseCase } from './use-cases/bulk-create-student-enrollment.use-case.js';
import { CreateStudentEnrollmentUseCase } from './use-cases/create-student-enrollment.use-case.js';
import { DeleteStudentEnrollmentUseCase } from './use-cases/delete-student-enrollment.use-case.js';
import { DropStudentUseCase } from './use-cases/drop-student.use-case.js';
import { GetStudentEnrollmentByIdUseCase } from './use-cases/get-student-enrollment-by-id.use-case.js';
import { GetStudentEnrollmentsUseCase } from './use-cases/get-student-enrollments.use-case.js';
import { TransferStudentUseCase } from './use-cases/transfer-student.use-case.js';
import { BulkTransferStudentUseCase } from './use-cases/bulk-transfer-student.use-case.js';
import { UpdateStudentEnrollmentUseCase } from './use-cases/update-student-enrollment.use-case.js';

@Module({
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsRepository,
    GetStudentEnrollmentsUseCase,
    GetStudentEnrollmentByIdUseCase,
    CreateStudentEnrollmentUseCase,
    BulkCreateStudentEnrollmentUseCase,
    UpdateStudentEnrollmentUseCase,
    DeleteStudentEnrollmentUseCase,
    TransferStudentUseCase,
    BulkTransferStudentUseCase,
    DropStudentUseCase,
  ],
  exports: [EnrollmentsRepository],
})
export class EnrollmentsModule {}
