import { Module } from '@nestjs/common';
import { ClassroomsController } from './controllers/classrooms.controller.js';
import { ClassroomStructuresController } from './controllers/classroom-structures.controller.js';
import { ClassroomSupervisorsController } from './controllers/classroom-supervisors.controller.js';
import { ClassroomsRepository } from './repositories/classrooms.repository.js';
import { ClassroomStructuresRepository } from './repositories/classroom-structures.repository.js';
import { ClassroomSupervisorsRepository } from './repositories/classroom-supervisors.repository.js';

// Services
import { CreateClassroomUseCase } from './use-cases/create-classroom.use-case.js';
import { DeleteClassroomUseCase } from './use-cases/delete-classroom.use-case.js';
import { GetClassroomByIdUseCase } from './use-cases/get-classroom-by-id.use-case.js';
import { GetClassroomsUseCase } from './use-cases/get-classrooms.use-case.js';
import { UpdateClassroomUseCase } from './use-cases/update-classroom.use-case.js';
import { CreateClassroomStructureUseCase } from './use-cases/create-classroom-structure.use-case.js';
import { DeleteClassroomStructureUseCase } from './use-cases/delete-classroom-structure.use-case.js';
import { GetClassroomStructuresUseCase } from './use-cases/get-classroom-structures.use-case.js';
import { UpdateClassroomStructureUseCase } from './use-cases/update-classroom-structure.use-case.js';
import { CreateClassroomSupervisorUseCase } from './use-cases/create-classroom-supervisor.use-case.js';
import { DeleteClassroomSupervisorUseCase } from './use-cases/delete-classroom-supervisor.use-case.js';
import { GetClassroomSupervisorByIdUseCase } from './use-cases/get-classroom-supervisor-by-id.use-case.js';
import { GetClassroomSupervisorsUseCase } from './use-cases/get-classroom-supervisors.use-case.js';
import { UpdateClassroomSupervisorUseCase } from './use-cases/update-classroom-supervisor.use-case.js';

@Module({
  controllers: [
    ClassroomsController,
    ClassroomStructuresController,
    ClassroomSupervisorsController,
  ],
  providers: [
    ClassroomsRepository,
    ClassroomStructuresRepository,
    ClassroomSupervisorsRepository,
    CreateClassroomUseCase,
    DeleteClassroomUseCase,
    GetClassroomByIdUseCase,
    GetClassroomsUseCase,
    UpdateClassroomUseCase,
    CreateClassroomStructureUseCase,
    DeleteClassroomStructureUseCase,
    GetClassroomStructuresUseCase,
    UpdateClassroomStructureUseCase,
    CreateClassroomSupervisorUseCase,
    DeleteClassroomSupervisorUseCase,
    GetClassroomSupervisorByIdUseCase,
    GetClassroomSupervisorsUseCase,
    UpdateClassroomSupervisorUseCase,
  ],
  exports: [
    ClassroomsRepository,
    ClassroomStructuresRepository,
    ClassroomSupervisorsRepository,
  ],
})
export class ClassroomsModule {}
