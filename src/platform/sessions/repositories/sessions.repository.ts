import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserSessions(userId: string) {
    return this.prisma.authSession.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.authSession.findUnique({
      where: { id },
    });
  }

  async revoke(id: string) {
    return this.prisma.authSession.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAll(userId: string) {
    return this.prisma.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
