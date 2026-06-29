import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SchoolUnitsRepository } from '../../platform/school-units/repositories/school-units.repository.js';

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(private readonly schoolUnitsRepo: SchoolUnitsRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;
    if (!host) {
      return next();
    }

    const cleanHost = host.split(':')[0].toLowerCase();
    const baseDomain = process.env.BASE_DOMAIN || 'schoolhub.id';

    // If it's the base domain or localhost, skip tenant resolution
    if (
      cleanHost === baseDomain ||
      cleanHost === 'localhost' ||
      cleanHost === '127.0.0.1'
    ) {
      return next();
    }

    // Try to resolve the tenant by host/subdomain
    const schoolUnit = await this.schoolUnitsRepo.findByDomain(host);
    if (!schoolUnit) {
      throw new NotFoundException(
        `School unit not found for host: ${cleanHost}`,
      );
    }

    // Set tenant context on the request
    (req as any).tenantContext = {
      tenantId: (schoolUnit as any).organization?.tenantId,
      organizationId: schoolUnit.organizationId,
      schoolUnitId: schoolUnit.id,
    };

    next();
  }
}
