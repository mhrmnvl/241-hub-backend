import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository.js';
import type { JwtTokenPayload } from '../types/jwt-token-payload.type.js';

@Injectable()
export class ValidateTokenUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(payload: JwtTokenPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    const session = await this.authRepository.findSessionWithUser(
      payload.sessionId,
    );

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    if (!session.user.isActive || session.user.deletedAt) {
      throw new UnauthorizedException('User account is deactivated');
    }

    return {
      id: session.user.id,
      identifier: session.user.identifier,
      organizationId: session.user.organizationId,
      schoolUnitId: session.user.schoolUnitId,
      isActive: session.user.isActive,
      sessionId: session.id,
    };
  }
}
