import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TenantContext } from '../types/tenant-context.type.js';

export type { TenantContext };

export const ReqTenantContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TenantContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantContext;
  },
);
