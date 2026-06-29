import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomsRepository } from '../repositories/classrooms.repository.js';
import { withDisplayName } from '../../../shared/utils/classroom-display-name.helper.js';

@Injectable()
export class GetClassroomByIdUseCase {
  constructor(private readonly repository: ClassroomsRepository) {}

  async execute(id: string) {
    const classRecord = await this.repository.findById(id);
    if (!classRecord)
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    return withDisplayName(classRecord);
  }
}
