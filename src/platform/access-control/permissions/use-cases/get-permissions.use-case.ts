import { Injectable } from '@nestjs/common';
import { PermissionsRepository } from '../repositories/permissions.repository.js';

@Injectable()
export class GetPermissionsUseCase {
  constructor(private readonly permissionsRepo: PermissionsRepository) {}

  async execute() {
    return this.permissionsRepo.findAll();
  }
}
