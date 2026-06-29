import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClassroomLevelsRepository } from '../repositories/grades.repository.js';

@Injectable()
export class DeleteClassroomLevelUseCase {
  private readonly logger = new Logger(DeleteClassroomLevelUseCase.name);

  constructor(private readonly repository: ClassroomLevelsRepository) {}

  async execute(id: string) {
    const level = await this.repository.findById(id);
    if (!level) {
      throw new NotFoundException(`Classroom level with ID ${id} not found`);
    }

    await this.repository.softDelete(id);
    this.logger.log(`Classroom level deleted: ${id}`);
  }
}
