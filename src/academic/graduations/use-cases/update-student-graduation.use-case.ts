import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStudentGraduationDto } from '../dto/update-student-graduation.dto.js';
import { GraduationsRepository } from '../repositories/graduations.repository.js';

@Injectable()
export class UpdateStudentGraduationUseCase {
  constructor(private readonly repo: GraduationsRepository) {}
  async execute(id: string, dto: UpdateStudentGraduationDto) {
    const graduation = await this.repo.findById(id);
    if (!graduation) {
      throw new NotFoundException(`StudentGraduation ${id} not found`);
    }
    return this.repo.update(id, dto);
  }
}
