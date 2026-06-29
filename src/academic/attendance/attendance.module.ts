import { Module } from '@nestjs/common';
import { AttendanceController } from './controllers/attendance.controller.js';
import { AttendanceRepository } from './repositories/attendance.repository.js';
import {
  GetAttendancesUseCase,
  GetAttendanceByIdUseCase,
  CreateAttendanceUseCase,
  UpdateAttendanceUseCase,
  DeleteAttendanceUseCase,
  BulkUpsertAttendanceUseCase,
  GetAttendanceRecapUseCase,
} from './use-cases/attendance.use-case.js';

@Module({
  controllers: [AttendanceController],
  providers: [
    AttendanceRepository,
    GetAttendancesUseCase,
    GetAttendanceByIdUseCase,
    CreateAttendanceUseCase,
    UpdateAttendanceUseCase,
    DeleteAttendanceUseCase,
    BulkUpsertAttendanceUseCase,
    GetAttendanceRecapUseCase,
  ],
  exports: [AttendanceRepository],
})
export class AttendanceModule {}
