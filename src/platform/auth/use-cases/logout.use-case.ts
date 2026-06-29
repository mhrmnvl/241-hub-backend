import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository.js';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(private readonly authRepository: AuthRepository) {}

  async execute(sessionId: string): Promise<void> {
    await this.authRepository.revokeSession(sessionId);
    this.logger.log(`Session ${sessionId} revoked`);
  }
}
