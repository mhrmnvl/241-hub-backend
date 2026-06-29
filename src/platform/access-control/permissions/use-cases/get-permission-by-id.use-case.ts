import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionsRepository } from '../repositories/permissions.repository.js';

@Injectable()
export class GetPermissionByIdUseCase {
  constructor(private readonly permissionsRepo: PermissionsRepository) {}

  async execute(id: string) {
    const permission = await this.permissionsRepo.findById(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }
}
