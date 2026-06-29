import { Injectable } from '@nestjs/common';
import { AuditLogsRepository } from '../repositories/audit-logs.repository.js';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto.js';

@Injectable()
export class GetAuditLogsUseCase {
  constructor(private readonly auditLogsRepo: AuditLogsRepository) {}

  async execute(query: AuditLogQueryDto) {
    return this.auditLogsRepo.findAll(query);
  }
}
