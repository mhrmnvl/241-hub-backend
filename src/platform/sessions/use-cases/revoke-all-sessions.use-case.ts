import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from '../repositories/sessions.repository.js';
import { UsersRepository } from '../../users/repositories/users.repository.js';

@Injectable()
export class RevokeAllSessionsUseCase {
  private readonly logger = new Logger(RevokeAllSessionsUseCase.name);

  constructor(
    private readonly sessionsRepo: SessionsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const userExists = await this.usersRepo.existsById(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.sessionsRepo.revokeAll(userId);
    this.logger.log(`All sessions for user ${userId} revoked`);
  }
}
