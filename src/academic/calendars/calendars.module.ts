import { Module } from '@nestjs/common';
import { AcademicYearsModule } from '../academic-years/academic-years.module.js';
import { SemestersModule } from '../semesters/semesters.module.js';
import { ClassroomsModule } from '../classrooms/classrooms.module.js';
import { AcademicCalendarsController } from './controllers/academic-calendars.controller.js';
import { EventsController } from './controllers/events.controller.js';
import { AcademicCalendarsRepository } from './repositories/academic-calendars.repository.js';
import { EventsRepository } from './repositories/events.repository.js';

import { CreateAcademicCalendarUseCase } from './use-cases/create-academic-calendar.use-case.js';
import { DeleteAcademicCalendarUseCase } from './use-cases/delete-academic-calendar.use-case.js';
import { GetAcademicCalendarByIdUseCase } from './use-cases/get-academic-calendar-by-id.use-case.js';
import { GetAcademicCalendarsUseCase } from './use-cases/get-academic-calendars.use-case.js';
import { UpdateAcademicCalendarUseCase } from './use-cases/update-academic-calendar.use-case.js';

import { CreateEventUseCase } from './use-cases/create-event.use-case.js';
import { DeleteEventUseCase } from './use-cases/delete-event.use-case.js';
import { GetEventByIdUseCase } from './use-cases/get-event-by-id.use-case.js';
import { GetEventsUseCase } from './use-cases/get-events.use-case.js';
import { UpdateEventUseCase } from './use-cases/update-event.use-case.js';

@Module({
  imports: [AcademicYearsModule, SemestersModule, ClassroomsModule],
  controllers: [AcademicCalendarsController, EventsController],
  providers: [
    AcademicCalendarsRepository,
    EventsRepository,

    GetAcademicCalendarsUseCase,
    GetAcademicCalendarByIdUseCase,
    CreateAcademicCalendarUseCase,
    UpdateAcademicCalendarUseCase,
    DeleteAcademicCalendarUseCase,

    GetEventsUseCase,
    GetEventByIdUseCase,
    CreateEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
  ],
  exports: [AcademicCalendarsRepository, EventsRepository],
})
export class CalendarsModule {}
