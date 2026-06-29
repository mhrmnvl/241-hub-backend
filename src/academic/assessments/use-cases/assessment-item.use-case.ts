import { Injectable, NotFoundException } from '@nestjs/common';
import { AssessmentItemsRepository } from '../repositories/assessment-items.repository.js';
import {
  CreateAssessmentItemDto,
  UpdateAssessmentItemDto,
  AssessmentItemQueryDto,
} from '../dto/assessment-item.dto.js';

@Injectable()
export class GetAssessmentItemsUseCase {
  constructor(private readonly repo: AssessmentItemsRepository) {}
  async execute(query: AssessmentItemQueryDto) {
    return this.repo.findAll(query);
  }
}

@Injectable()
export class GetAssessmentItemByIdUseCase {
  constructor(private readonly repo: AssessmentItemsRepository) {}
  async execute(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`AssessmentItem ${id} not found`);
    return r;
  }
}

@Injectable()
export class CreateAssessmentItemUseCase {
  constructor(private readonly repo: AssessmentItemsRepository) {}
  async execute(dto: CreateAssessmentItemDto) {
    return this.repo.create(dto);
  }
}

@Injectable()
export class UpdateAssessmentItemUseCase {
  constructor(private readonly repo: AssessmentItemsRepository) {}
  async execute(id: string, dto: UpdateAssessmentItemDto) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`AssessmentItem ${id} not found`);
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class DeleteAssessmentItemUseCase {
  constructor(private readonly repo: AssessmentItemsRepository) {}
  async execute(id: string) {
    const r = await this.repo.findById(id);
    if (!r) throw new NotFoundException(`AssessmentItem ${id} not found`);
    return this.repo.softDelete(id);
  }
}
