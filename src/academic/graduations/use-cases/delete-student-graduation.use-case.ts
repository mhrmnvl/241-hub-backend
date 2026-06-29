import { Injectable, NotFoundException } from '@nestjs/common';
import { GraduationsRepository } from '../repositories/graduations.repository.js';

@Injectable()
export class DeleteStudentGraduationUseCase {
  constructor(private readonly repo: GraduationsRepository) {}
  async execute(id: string) {
    const graduation = await this.repo.findById(id);
    if (!graduation) {
      throw new NotFoundException(`StudentGraduation ${id} not found`);
    }
    return this.repo.softDelete(id);
  }
}
