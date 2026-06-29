import { Injectable } from '@nestjs/common';
import { ClassroomLevelQueryDto } from '../dto/grade-query.dto.js';
import { ClassroomLevelsRepository } from '../repositories/grades.repository.js';

@Injectable()
export class GetClassroomLevelsUseCase {
  constructor(private readonly repository: ClassroomLevelsRepository) {}

  async execute(query: ClassroomLevelQueryDto) {
    return this.repository.findAll(query);
  }
}
