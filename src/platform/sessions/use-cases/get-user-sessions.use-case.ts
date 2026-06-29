import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from '../repositories/sessions.repository.js';
import { UsersRepository } from '../../users/repositories/users.repository.js';

@Injectable()
export class GetUserSessionsUseCase {
  constructor(
    private readonly sessionsRepo: SessionsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async execute(userId: string) {
    const userExists = await this.usersRepo.existsById(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.sessionsRepo.findUserSessions(userId);
  }
}
