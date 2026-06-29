import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto.js';
import { RolesRepository } from '../repositories/roles.repository.js';

@Injectable()
export class CreateRoleUseCase {
  private readonly logger = new Logger(CreateRoleUseCase.name);

  constructor(private readonly rolesRepo: RolesRepository) {}

  async execute(organizationId: string, dto: CreateRoleDto) {
    const existing = await this.rolesRepo.findByCode(dto.code, organizationId);
    if (existing) {
      throw new ConflictException(
        `Role with code ${dto.code} already exists in this organization`,
      );
    }

    const role = await this.rolesRepo.create(organizationId, dto);
    this.logger.log(`Role created: ${role.code} (${role.name})`);
    return role;
  }
}
