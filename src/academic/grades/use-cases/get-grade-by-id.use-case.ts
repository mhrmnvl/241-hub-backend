import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomLevelsRepository } from '../repositories/grades.repository.js';

@Injectable()
export class GetClassroomLevelByIdUseCase {
  constructor(private readonly repository: ClassroomLevelsRepository) {}

  async execute(id: string) {
    const level = await this.repository.findById(id);
    if (!level) {
      throw new NotFoundException(`Classroom level with ID ${id} not found`);
    }
    return level;
  }
}
