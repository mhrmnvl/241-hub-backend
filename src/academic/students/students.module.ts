import { Module } from '@nestjs/common';
import { GradesModule } from '../grades/grades.module.js';
import { ClassroomsModule } from '../classrooms/classrooms.module.js';
import { SemestersModule } from '../semesters/semesters.module.js';
import { EnrollmentsModule } from '../enrollments/enrollments.module.js';
import { StudentsController } from './controllers/students.controller.js';
import { StudentAddressesController } from './controllers/student-addresses.controller.js';
import { StudentParentsController } from './controllers/student-parents.controller.js';
import { StudentProfilesController } from './controllers/student-profiles.controller.js';
import { StudentsRepository } from './repositories/students.repository.js';
import { StudentAddressesRepository } from './repositories/student-addresses.repository.js';
import { StudentParentsRepository } from './repositories/student-parents.repository.js';

// Services
import { CreateStudentUseCase } from './use-cases/create-student.use-case.js';
import { DeleteStudentUseCase } from './use-cases/delete-student.use-case.js';
import { GetStudentByIdUseCase } from './use-cases/get-student-by-id.use-case.js';
import { GetStudentsUseCase } from './use-cases/get-students.use-case.js';
import { UpdateStudentUseCase } from './use-cases/update-student.use-case.js';
import { ToggleStudentActiveUseCase } from './use-cases/toggle-student-active.use-case.js';
import { BulkImportStudentsUseCase } from './use-cases/bulk-import-students.use-case.js';
import { ExportStudentsUseCase } from './use-cases/export-students.use-case.js';
import { AddStudentAddressUseCase } from './use-cases/add-student-address.use-case.js';
import { GetStudentAddressesUseCase } from './use-cases/get-student-addresses.use-case.js';
import { UpdateStudentAddressUseCase } from './use-cases/update-student-address.use-case.js';
import { RemoveStudentAddressUseCase } from './use-cases/remove-student-address.use-case.js';
import { CreateStudentParentUseCase } from './use-cases/create-student-parent.use-case.js';
import { GetStudentParentsListUseCase } from './use-cases/get-student-parents-list.use-case.js';
import { GetStudentParentByIdUseCase } from './use-cases/get-student-parent-by-id.use-case.js';
import { UpdateStudentParentUseCase } from './use-cases/update-student-parent.use-case.js';
import { DeleteStudentParentUseCase } from './use-cases/delete-student-parent.use-case.js';
import { UpdateStudentProfileUseCase } from './use-cases/update-student-profile.use-case.js';

@Module({
  imports: [GradesModule, ClassroomsModule, SemestersModule, EnrollmentsModule],
  controllers: [
    StudentsController,
    StudentAddressesController,
    StudentParentsController,
    StudentProfilesController,
  ],
  providers: [
    StudentsRepository,
    StudentAddressesRepository,
    StudentParentsRepository,
    CreateStudentUseCase,
    DeleteStudentUseCase,
    GetStudentByIdUseCase,
    GetStudentsUseCase,
    UpdateStudentUseCase,
    ToggleStudentActiveUseCase,
    BulkImportStudentsUseCase,
    ExportStudentsUseCase,
    AddStudentAddressUseCase,
    GetStudentAddressesUseCase,
    UpdateStudentAddressUseCase,
    RemoveStudentAddressUseCase,
    CreateStudentParentUseCase,
    GetStudentParentsListUseCase,
    GetStudentParentByIdUseCase,
    UpdateStudentParentUseCase,
    DeleteStudentParentUseCase,
    UpdateStudentProfileUseCase,
  ],
  exports: [
    StudentsRepository,
    StudentAddressesRepository,
    StudentParentsRepository,
  ],
})
export class StudentsModule {}
