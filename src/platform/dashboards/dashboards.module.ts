import { Module } from '@nestjs/common';
import { DashboardsController } from './controllers/dashboards.controller.js';
import { DashboardsRepository } from './repositories/dashboards.repository.js';
import { GetDashboardSummaryService } from './services/get-dashboard-summary.service.js';

@Module({
  controllers: [DashboardsController],
  providers: [DashboardsRepository, GetDashboardSummaryService],
})
export class DashboardsModule {}
