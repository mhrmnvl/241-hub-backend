import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import {
  CreateSessionData,
  UpdateSessionTokenData,
} from '../types/auth-session.types.js';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByIdentifier(identifier: string, schoolUnitId: string | null) {
    if (!schoolUnitId) {
      return this.prisma.user.findFirst({
        where: {
          identifier,
          deletedAt: null,
        },
      });
    }
    return this.prisma.user.findFirst({
      where: {
        identifier,
        schoolUnitId,
        deletedAt: null,
      },
    });
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userRoles: { include: { role: true } },
      },
    });
  }

  async findSessionWithUser(sessionId: string) {
    return this.prisma.authSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
  }

  async createSession(data: CreateSessionData) {
    return this.prisma.authSession.create({
      data: {
        id: data.id,
        userId: data.userId,
        tokenHash: data.tokenHash,
        userAgent: data.userAgent?.substring(0, 512),
        ipAddress: data.ipAddress?.substring(0, 64),
        expiresAt: data.expiresAt,
      },
    });
  }

  async updateSessionToken(sessionId: string, data: UpdateSessionTokenData) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: {
        tokenHash: data.tokenHash,
        lastUsedAt: data.lastUsedAt,
        expiresAt: data.expiresAt,
      },
    });
  }

  async revokeSession(sessionId: string) {
    return this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async deleteExpiredSessions(now: Date, auditRetentionMs: number) {
    return this.prisma.authSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          {
            revokedAt: {
              not: null,
              lt: new Date(now.getTime() - auditRetentionMs),
            },
          },
        ],
      },
    });
  }
}
