import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStudentGraduationDto } from '../dto/create-student-graduation.dto.js';
import { GraduationsRepository } from '../repositories/graduations.repository.js';

@Injectable()
export class CreateStudentGraduationUseCase {
  constructor(private readonly repo: GraduationsRepository) {}
  async execute(dto: CreateStudentGraduationDto) {
    const existing = await this.repo.findByStudentId(dto.studentId);
    if (existing) {
      throw new ConflictException('Student already has a graduation record');
    }
    return this.repo.create(dto);
  }
}
