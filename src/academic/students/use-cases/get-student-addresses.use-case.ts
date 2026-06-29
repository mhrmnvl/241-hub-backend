import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentAddressesRepository } from '../repositories/student-addresses.repository.js';
import { StudentsRepository, RequestUser } from '../index.js';

@Injectable()
export class GetStudentAddressesUseCase {
  constructor(
    private readonly repo: StudentsRepository,
    private readonly addressRepo: StudentAddressesRepository,
  ) {}

  async execute(studentId: string, requester?: RequestUser) {
    if (requester) {
      const isStudent = await this.repo.isStudent(requester.id);
      if (isStudent) {
        const own = await this.repo.findByUserId(requester.id);
        if (!own)
          throw new ForbiddenException(
            'Student account is not linked to an active student record',
          );
        if (own.id !== studentId)
          throw new ForbiddenException(
            'You can only access your own student data',
          );
      }
    }
    const student = await this.repo.findById(studentId);
    if (!student)
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    return this.addressRepo.findAll(studentId);
  }
}
