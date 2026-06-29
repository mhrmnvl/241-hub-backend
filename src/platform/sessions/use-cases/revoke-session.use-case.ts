import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from '../repositories/sessions.repository.js';

@Injectable()
export class RevokeSessionUseCase {
  private readonly logger = new Logger(RevokeSessionUseCase.name);

  constructor(private readonly sessionsRepo: SessionsRepository) {}

  async execute(sessionId: string): Promise<void> {
    const session = await this.sessionsRepo.findById(sessionId);
    if (!session || session.revokedAt) {
      throw new NotFoundException(
        `Active session with ID ${sessionId} not found`,
      );
    }

    await this.sessionsRepo.revoke(sessionId);
    this.logger.log(`Session ${sessionId} manually revoked`);
  }
}
