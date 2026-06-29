import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository.js';

@Injectable()
export class DeleteRoleUseCase {
  private readonly logger = new Logger(DeleteRoleUseCase.name);

  constructor(private readonly rolesRepo: RolesRepository) {}

  async execute(id: string, organizationId: string) {
    const role = await this.rolesRepo.findById(id, organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted');
    }

    await this.rolesRepo.delete(id);
    this.logger.log(`Role deleted: ${role.code}`);
  }
}
