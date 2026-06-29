import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard.js';
import { AuthController } from './controllers/auth.controller.js';
import { AuthRepository } from './repositories/auth.repository.js';
import { AuthCleanupService } from './services/auth-cleanup.service.js';
import { TokenManagerService } from './services/token-manager.service.js';
import { PasswordManagerService } from './services/password-manager.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { GetProfileUseCase } from './use-cases/get-profile.use-case.js';
import { LoginUseCase } from './use-cases/login.use-case.js';
import { LogoutUseCase } from './use-cases/logout.use-case.js';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case.js';
import { ValidateTokenUseCase } from './use-cases/validate-token.use-case.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,

    TokenManagerService,
    PasswordManagerService,
    AuthCleanupService,

    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GetProfileUseCase,
    ValidateTokenUseCase,

    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    TokenManagerService,
    PasswordManagerService,
    JwtAuthGuard,
    ValidateTokenUseCase,
  ],
})
export class AuthModule {}
