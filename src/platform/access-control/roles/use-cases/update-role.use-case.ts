import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRoleDto } from '../dto/update-role.dto.js';
import { RolesRepository } from '../repositories/roles.repository.js';

@Injectable()
export class UpdateRoleUseCase {
  private readonly logger = new Logger(UpdateRoleUseCase.name);

  constructor(private readonly rolesRepo: RolesRepository) {}

  async execute(id: string, organizationId: string, dto: UpdateRoleDto) {
    const role = await this.rolesRepo.findById(id, organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be edited');
    }

    const updatedRole = await this.rolesRepo.update(id, dto);
    this.logger.log(`Role updated: ${role.code}`);
    return updatedRole;
  }
}
