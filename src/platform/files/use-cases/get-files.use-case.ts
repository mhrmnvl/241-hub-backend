import { Injectable } from '@nestjs/common';
import { FilesRepository } from '../repositories/files.repository.js';

@Injectable()
export class GetFilesUseCase {
  constructor(private readonly repo: FilesRepository) {}

  async execute(organizationId: string, schoolUnitId?: string) {
    return this.repo.findMany(organizationId, schoolUnitId);
  }
}
