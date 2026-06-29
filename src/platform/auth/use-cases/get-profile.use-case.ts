import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository.js';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      identifier: user.identifier,
      organizationId: user.organizationId,
      schoolUnitId: user.schoolUnitId,
      isActive: user.isActive,
      name: user.profile?.name ?? null,
      roles: user.userRoles?.map((ur) => ur.role.code) ?? [],
    };
  }
}
