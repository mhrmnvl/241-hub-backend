import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository.js';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(private readonly rolesRepo: RolesRepository) {}

  async execute(id: string, organizationId: string) {
    const role = await this.rolesRepo.findById(id, organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }
}
