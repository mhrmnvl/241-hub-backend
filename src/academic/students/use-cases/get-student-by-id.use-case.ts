import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  StudentsRepository,
  RequestUser,
} from '../repositories/students.repository.js';

@Injectable()
export class GetStudentByIdUseCase {
  constructor(private readonly repo: StudentsRepository) {}

  async execute(id: string, requester?: RequestUser) {
    if (requester) {
      const isStudent = await this.repo.isStudent(requester.id);
      if (isStudent) {
        const own = await this.repo.findByUserId(requester.id);
        if (!own)
          throw new ForbiddenException(
            'Student account is not linked to an active student record',
          );
        if (own.id !== id)
          throw new ForbiddenException(
            'You can only access your own student data',
          );
      }
    }

    const student = await this.repo.findById(id);
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }
}
