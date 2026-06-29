import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository.js';

@Injectable()
export class GetRolesUseCase {
  constructor(private readonly rolesRepo: RolesRepository) {}

  async execute(organizationId: string) {
    return this.rolesRepo.findAll(organizationId);
  }
}
