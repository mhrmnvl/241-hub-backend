import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentScoresRepository } from '../repositories/student-scores.repository.js';
import {
  CreateStudentScoreDto,
  UpdateStudentScoreDto,
  StudentScoreQueryDto,
} from '../dto/student-score.dto.js';

@Injectable()
export class GetStudentScoresUseCase {
  constructor(private readonly repo: StudentScoresRepository) {}
  async execute(query: StudentScoreQueryDto) {
    return this.repo.findAll(query);
  }
}

@Injectable()
export class GetStudentScoreByIdUseCase {
  constructor(private readonly repo: StudentScoresRepository) {}
  async execute(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`StudentScore ${id} not found`);
    return r;
  }
}

@Injectable()
export class CreateStudentScoreUseCase {
  constructor(private readonly repo: StudentScoresRepository) {}
  async execute(dto: CreateStudentScoreDto) {
    const dup = await this.repo.findDuplicate(
      dto.enrollmentId,
      dto.assessmentItemId,
    );
    if (dup)
      throw new ConflictException(
        'Score already exists for this enrollment and assessment',
      );

    const softDeleted = await this.repo.findSoftDeleted(
      dto.enrollmentId,
      dto.assessmentItemId,
    );
    if (softDeleted) {
      return this.repo.restore(softDeleted.id, {
        score: dto.score,
        note: dto.note,
      });
    }

    return this.repo.create(dto);
  }
}

@Injectable()
export class UpdateStudentScoreUseCase {
  constructor(private readonly repo: StudentScoresRepository) {}
  async execute(id: string, dto: UpdateStudentScoreDto) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`StudentScore ${id} not found`);
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class DeleteStudentScoreUseCase {
  constructor(private readonly repo: StudentScoresRepository) {}
  async execute(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`StudentScore ${id} not found`);
    return this.repo.softDelete(id);
  }
}
