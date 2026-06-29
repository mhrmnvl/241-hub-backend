import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditLogsRepository } from '../repositories/audit-logs.repository.js';

@Injectable()
export class CreateAuditLogUseCase {
  private readonly logger = new Logger(CreateAuditLogUseCase.name);

  constructor(private readonly auditLogsRepo: AuditLogsRepository) {}

  async execute(data: {
    userId?: string | null;
    action: string;
    resource: string;
    resourceId?: string | null;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    const log = await this.auditLogsRepo.create(data);
    this.logger.log(`Audit log created: ${log.action} on ${log.resource}`);
    return log;
  }
}
