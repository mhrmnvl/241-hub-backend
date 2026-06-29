import { Module } from '@nestjs/common';
import { TeachingAssignmentsController } from './controllers/teaching-assignments.controller.js';
import { TeachingAssignmentsRepository } from './repositories/teaching-assignments.repository.js';
import { CreateTeachingAssignmentUseCase } from './use-cases/create-teaching-assignment.use-case.js';
import { DeleteTeachingAssignmentUseCase } from './use-cases/delete-teaching-assignment.use-case.js';
import { GetTeachingAssignmentByIdUseCase } from './use-cases/get-teaching-assignment-by-id.use-case.js';
import { GetTeachingAssignmentsUseCase } from './use-cases/get-teaching-assignments.use-case.js';
import { UpdateTeachingAssignmentUseCase } from './use-cases/update-teaching-assignment.use-case.js';

@Module({
  controllers: [TeachingAssignmentsController],
  providers: [
    TeachingAssignmentsRepository,
    GetTeachingAssignmentsUseCase,
    GetTeachingAssignmentByIdUseCase,
    CreateTeachingAssignmentUseCase,
    UpdateTeachingAssignmentUseCase,
    DeleteTeachingAssignmentUseCase,
  ],
  exports: [TeachingAssignmentsRepository],
})
export class TeachingAssignmentsModule {}
