import { Module } from '@nestjs/common';
import { SchoolUnitsController } from './controllers/school-units.controller.js';
import { SchoolUnitAddressesController } from './controllers/school-unit-addresses.controller.js';
import { SchoolUnitSocialMediaController } from './controllers/school-unit-social-media.controller.js';
import { SchoolUnitsRepository } from './repositories/school-units.repository.js';
import { SchoolUnitAddressesRepository } from './repositories/school-unit-addresses.repository.js';
import { SchoolUnitSocialMediaRepository } from './repositories/school-unit-social-media.repository.js';

// Use cases
import { GetSchoolUnitUseCase } from './use-cases/get-school-unit.use-case.js';
import { SetupSchoolUnitUseCase } from './use-cases/setup-school-unit.use-case.js';
import { UpdateSchoolUnitUseCase } from './use-cases/update-school-unit.use-case.js';
import { SchoolUnitAddressUseCase } from './use-cases/school-unit-address.use-case.js';
import { SchoolUnitSocialMediaUseCase } from './use-cases/school-unit-social-media.use-case.js';

@Module({
  controllers: [
    SchoolUnitsController,
    SchoolUnitAddressesController,
    SchoolUnitSocialMediaController,
  ],
  providers: [
    SchoolUnitsRepository,
    SchoolUnitAddressesRepository,
    SchoolUnitSocialMediaRepository,
    GetSchoolUnitUseCase,
    SetupSchoolUnitUseCase,
    UpdateSchoolUnitUseCase,
    SchoolUnitAddressUseCase,
    SchoolUnitSocialMediaUseCase,
  ],
  exports: [
    SchoolUnitsRepository,
    SchoolUnitAddressesRepository,
    SchoolUnitSocialMediaRepository,
  ],
})
export class SchoolUnitsModule {}
