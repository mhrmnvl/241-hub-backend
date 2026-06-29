import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentParentsRepository } from '../repositories/student-parents.repository.js';

@Injectable()
export class GetStudentParentByIdUseCase {
  constructor(private readonly repo: StudentParentsRepository) {}

  async execute(id: string) {
    const link = await this.repo.findById(id);
    if (!link)
      throw new NotFoundException(
        `Student-parent link with ID ${id} not found`,
      );
    return link;
  }
}
