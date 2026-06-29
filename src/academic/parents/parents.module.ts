import { Module } from '@nestjs/common';
import { ParentsController } from './controllers/parents.controller.js';
import { ParentsRepository } from './repositories/parents.repository.js';
import { CreateParentUseCase } from './use-cases/create-parent.use-case.js';
import { DeleteParentUseCase } from './use-cases/delete-parent.use-case.js';
import { GetParentByIdUseCase } from './use-cases/get-parent-by-id.use-case.js';
import { GetParentsUseCase } from './use-cases/get-parents.use-case.js';
import { UpdateParentUseCase } from './use-cases/update-parent.use-case.js';

@Module({
  controllers: [ParentsController],
  providers: [
    ParentsRepository,
    GetParentsUseCase,
    GetParentByIdUseCase,
    CreateParentUseCase,
    UpdateParentUseCase,
    DeleteParentUseCase,
  ],
  exports: [ParentsRepository],
})
export class ParentsModule {}
