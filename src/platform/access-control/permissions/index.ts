export { PermissionsModule } from './permissions.module.js';
export { PermissionsRepository } from './repositories/permissions.repository.js';
export { PermissionsGuard } from './guards/permissions.guard.js';
export {
  RequirePermissions,
  PERMISSIONS_KEY,
} from './decorators/require-permissions.decorator.js';
export { PermissionResponseDto } from './dto/permission-response.dto.js';
export { AssignPermissionDto } from './dto/assign-permission.dto.js';
export type { SystemPermission } from './types/system-permission.type.js';
