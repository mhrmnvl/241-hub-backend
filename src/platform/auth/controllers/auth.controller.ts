import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../../core/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard.js';
import { Public } from '../../../core/decorators/public.decorator.js';
import {
  AuthResponseDto,
  LogoutResponseDto,
  UserInfoDto,
} from '../dto/auth-response.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { GetProfileUseCase } from '../use-cases/get-profile.use-case.js';
import { LoginUseCase } from '../use-cases/login.use-case.js';
import { LogoutUseCase } from '../use-cases/logout.use-case.js';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case.js';

const REFRESH_TOKEN_COOKIE = 'refresh_token';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Throttle({ auth: {} })
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({
    status: 200,
    description:
      'Login successful — refresh token set as HttpOnly cookie, access token in body',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts — try again later',
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip ?? req.socket.remoteAddress;
    const tenantContext = (req as any).tenantContext;
    const schoolUnitId = tenantContext ? tenantContext.schoolUnitId : null;

    const result = await this.loginUseCase.execute(
      dto,
      schoolUnitId,
      userAgent,
      ipAddress,
    );

    this.setRefreshTokenCookie(
      res,
      result.refreshToken,
      result.refreshExpiresInMs,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Refresh access token using HttpOnly cookie',
    description:
      'Reads `refresh_token` from HttpOnly cookie set during login. Not testable via Swagger UI — use a REST client that supports cookies.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tokens rotated — new refresh token cookie set, new access token in body',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = (req.cookies as Record<string, string>)?.[
      REFRESH_TOKEN_COOKIE
    ];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    this.setRefreshTokenCookie(
      res,
      result.refreshToken,
      result.refreshExpiresInMs,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke current session' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful — session revoked, refresh cookie cleared',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  async logout(
    @CurrentUser() user: { sessionId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.logoutUseCase.execute(user.sessionId);

    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/auth',
    });

    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserInfoDto,
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  async getMe(@CurrentUser() user: { id: string }) {
    return this.getProfileUseCase.execute(user.id);
  }

  private setRefreshTokenCookie(res: Response, token: string, maxAge: number) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/auth',
      maxAge,
    });
  }
}
