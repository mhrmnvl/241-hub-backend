import { Module } from '@nestjs/common';
import { AuditLogsController } from './controllers/audit-logs.controller.js';
import { AuditLogsRepository } from './repositories/audit-logs.repository.js';
import { GetAuditLogsUseCase } from './use-cases/get-audit-logs.use-case.js';
import { CreateAuditLogUseCase } from './use-cases/create-audit-log.use-case.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsRepository, GetAuditLogsUseCase, CreateAuditLogUseCase],
  exports: [CreateAuditLogUseCase],
})
export class AuditLogsModule {}
