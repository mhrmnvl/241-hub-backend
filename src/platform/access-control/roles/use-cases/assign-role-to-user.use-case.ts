import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository.js';
import { UsersRepository } from '../../../users/repositories/users.repository.js';

@Injectable()
export class AssignRoleToUserUseCase {
  private readonly logger = new Logger(AssignRoleToUserUseCase.name);

  constructor(
    private readonly rolesRepo: RolesRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async execute(roleId: string, userId: string, organizationId: string) {
    const role = await this.rolesRepo.findById(roleId, organizationId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const userExists = await this.usersRepo.existsById(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existingRelation = await this.rolesRepo.findUserRole(userId, roleId);
    if (existingRelation) {
      throw new ConflictException('User already has this role');
    }

    await this.rolesRepo.assignRoleToUser(userId, roleId);
    this.logger.log(`Role ${role.code} assigned to user ${userId}`);
  }
}
