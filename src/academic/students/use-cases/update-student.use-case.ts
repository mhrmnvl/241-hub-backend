import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateStudentDto } from '../dto/update-student.dto.js';
import { StudentsRepository } from '../repositories/students.repository.js';

@Injectable()
export class UpdateStudentUseCase {
  private readonly logger = new Logger(UpdateStudentUseCase.name);

  constructor(private readonly repo: StudentsRepository) {}

  async execute(id: string, dto: UpdateStudentDto) {
    const student = await this.repo.findById(id);
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);

    if (dto.nis) {
      const dup = await this.repo.findByNis(dto.nis);
      if (dup && dup.id !== id)
        throw new ConflictException(`NIS "${dto.nis}" is already registered`);
    }
    if (dto.nisn) {
      const dup = await this.repo.findByNisn(dto.nisn);
      if (dup && dup.id !== id)
        throw new ConflictException(`NISN "${dto.nisn}" is already registered`);
    }

    const updated = await this.repo.update(id, dto);
    this.logger.log(`Student updated: ${id}`);
    return updated;
  }
}
