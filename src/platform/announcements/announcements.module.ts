import { Module } from '@nestjs/common';
import { ClassroomsModule } from '../../academic/classrooms/classrooms.module.js';
import { AnnouncementsController } from './controllers/announcements.controller.js';
import { AnnouncementsRepository } from './repositories/announcements.repository.js';
import { CreateAnnouncementUseCase } from './use-cases/create-announcement.use-case.js';
import { DeleteAnnouncementUseCase } from './use-cases/delete-announcement.use-case.js';
import { GetAnnouncementByIdUseCase } from './use-cases/get-announcement-by-id.use-case.js';
import { GetAnnouncementsUseCase } from './use-cases/get-announcements.use-case.js';
import { UpdateAnnouncementUseCase } from './use-cases/update-announcement.use-case.js';

@Module({
  imports: [ClassroomsModule],
  controllers: [AnnouncementsController],
  providers: [
    AnnouncementsRepository,

    GetAnnouncementsUseCase,
    GetAnnouncementByIdUseCase,
    CreateAnnouncementUseCase,
    UpdateAnnouncementUseCase,
    DeleteAnnouncementUseCase,
  ],
  exports: [AnnouncementsRepository],
})
export class AnnouncementsModule {}
