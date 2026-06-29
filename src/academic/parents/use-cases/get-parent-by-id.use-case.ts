import { Injectable, NotFoundException } from '@nestjs/common';
import { ParentsRepository } from '../repositories/parents.repository.js';

@Injectable()
export class GetParentByIdUseCase {
  constructor(private readonly repo: ParentsRepository) {}

  async execute(id: string) {
    const parent = await this.repo.findById(id);
    if (!parent) throw new NotFoundException(`Parent with ID ${id} not found`);
    return parent;
  }
}
