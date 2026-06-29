import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SubjectsRepository } from '../repositories/subjects.repository.js';

@Injectable()
export class DeleteSubjectUseCase {
  private readonly logger = new Logger(DeleteSubjectUseCase.name);

  constructor(private readonly repo: SubjectsRepository) {}

  async execute(id: string): Promise<void> {
    const subject = await this.repo.findById(id);
    if (!subject)
      throw new NotFoundException(`Subject with ID ${id} not found`);

    await this.repo.remove(id);
    this.logger.log(`Subject hard-deleted: ${id}`);
  }
}
