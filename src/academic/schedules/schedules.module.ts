import { Module } from '@nestjs/common';
import { SemestersModule } from '../semesters/semesters.module.js';
import { TeachingAssignmentsModule } from '../teaching-assignments/teaching-assignments.module.js';
import { ClassroomsModule } from '../classrooms/classrooms.module.js';
import { SchedulesController } from './controllers/schedules.controller.js';
import { TimeSlotsController } from './controllers/time-slots.controller.js';
import { SchedulesRepository } from './repositories/schedules.repository.js';
import { TimeSlotsRepository } from './repositories/time-slots.repository.js';

import {
  CreateScheduleUseCase,
  DeleteScheduleUseCase,
  GetScheduleByIdUseCase,
  GetSchedulesUseCase,
  UpdateScheduleUseCase,
  BatchUpsertScheduleUseCase,
  GetSchedulesByClassroomUseCase,
} from './use-cases/schedule.use-case.js';

import { CreateTimeSlotUseCase } from './use-cases/create-time-slot.use-case.js';
import { DeleteTimeSlotUseCase } from './use-cases/delete-time-slot.use-case.js';
import { GetTimeSlotByIdUseCase } from './use-cases/get-time-slot-by-id.use-case.js';
import { GetTimeSlotsUseCase } from './use-cases/get-time-slots.use-case.js';
import { UpdateTimeSlotUseCase } from './use-cases/update-time-slot.use-case.js';

@Module({
  imports: [SemestersModule, TeachingAssignmentsModule, ClassroomsModule],
  controllers: [SchedulesController, TimeSlotsController],
  providers: [
    SchedulesRepository,
    TimeSlotsRepository,

    GetSchedulesUseCase,
    GetScheduleByIdUseCase,
    GetSchedulesByClassroomUseCase,
    CreateScheduleUseCase,
    UpdateScheduleUseCase,
    DeleteScheduleUseCase,
    BatchUpsertScheduleUseCase,

    GetTimeSlotsUseCase,
    GetTimeSlotByIdUseCase,
    CreateTimeSlotUseCase,
    UpdateTimeSlotUseCase,
    DeleteTimeSlotUseCase,
  ],
  exports: [SchedulesRepository, TimeSlotsRepository],
})
export class SchedulesModule {}
