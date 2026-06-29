import { Injectable, Logger } from '@nestjs/common';
import { PermissionsRepository } from '../repositories/permissions.repository.js';
import { SYSTEM_PERMISSIONS } from '../constants/permission-codes.constants.js';

@Injectable()
export class SyncPermissionsUseCase {
  private readonly logger = new Logger(SyncPermissionsUseCase.name);

  constructor(private readonly permissionsRepo: PermissionsRepository) {}

  async execute(): Promise<void> {
    this.logger.log('Syncing system permissions with the database...');
    let count = 0;

    for (const permission of SYSTEM_PERMISSIONS) {
      await this.permissionsRepo.upsertPermission(permission);
      count++;
    }

    this.logger.log(`Successfully synced ${count} permissions.`);
  }
}
