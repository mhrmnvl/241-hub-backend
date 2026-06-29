import { Module } from '@nestjs/common';
import { SessionsController } from './controllers/sessions.controller.js';
import { SessionsRepository } from './repositories/sessions.repository.js';
import { GetUserSessionsUseCase } from './use-cases/get-user-sessions.use-case.js';
import { RevokeSessionUseCase } from './use-cases/revoke-session.use-case.js';
import { RevokeAllSessionsUseCase } from './use-cases/revoke-all-sessions.use-case.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [SessionsController],
  providers: [
    SessionsRepository,
    GetUserSessionsUseCase,
    RevokeSessionUseCase,
    RevokeAllSessionsUseCase,
  ],
  exports: [SessionsRepository],
})
export class SessionsModule {}
