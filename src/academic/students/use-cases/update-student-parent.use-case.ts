import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateStudentParentDto } from '../dto/update-student-parent.dto.js';
import { StudentParentsRepository } from '../repositories/student-parents.repository.js';

@Injectable()
export class UpdateStudentParentUseCase {
  private readonly logger = new Logger(UpdateStudentParentUseCase.name);

  constructor(private readonly repo: StudentParentsRepository) {}

  async execute(id: string, dto: UpdateStudentParentDto) {
    const current = await this.repo.findById(id);
    if (!current)
      throw new NotFoundException(
        `Student-parent link with ID ${id} not found`,
      );

    const updated = await this.repo.update(id, current.studentId, dto);
    this.logger.log(`Student-parent link updated: ${id}`);
    return updated;
  }
}
