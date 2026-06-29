import { Module } from '@nestjs/common';
import { ProfilesController } from './controllers/profiles.controller.js';
import { ProfileAddressesController } from './controllers/profile-addresses.controller.js';
import { ProfileSocialMediaController } from './controllers/profile-social-media.controller.js';
import { ProfilesRepository } from './repositories/profiles.repository.js';
import { ProfileAddressesRepository } from './repositories/profile-addresses.repository.js';
import { ProfileSocialMediaRepository } from './repositories/profile-social-media.repository.js';

// Services
import { GetProfileUseCase } from './use-cases/get-profile.use-case.js';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case.js';
import { AddProfileAddressUseCase } from './use-cases/add-profile-address.use-case.js';
import { GetProfileAddressesUseCase } from './use-cases/get-profile-addresses.use-case.js';
import { UpdateProfileAddressUseCase } from './use-cases/update-profile-address.use-case.js';
import { RemoveProfileAddressUseCase } from './use-cases/remove-profile-address.use-case.js';
import { AddProfileSocialMediaUseCase } from './use-cases/add-profile-social-media.use-case.js';
import { GetAllProfileSocialMediasUseCase } from './use-cases/get-all-profile-social-medias.use-case.js';
import { GetProfileSocialMediasUseCase } from './use-cases/get-profile-social-medias.use-case.js';
import { UpdateProfileSocialMediaUseCase } from './use-cases/update-profile-social-media.use-case.js';
import { RemoveProfileSocialMediaUseCase } from './use-cases/remove-profile-social-media.use-case.js';

@Module({
  controllers: [
    ProfilesController,
    ProfileAddressesController,
    ProfileSocialMediaController,
  ],
  providers: [
    ProfilesRepository,
    ProfileAddressesRepository,
    ProfileSocialMediaRepository,
    GetProfileUseCase,
    UpdateProfileUseCase,
    AddProfileAddressUseCase,
    GetProfileAddressesUseCase,
    UpdateProfileAddressUseCase,
    RemoveProfileAddressUseCase,
    AddProfileSocialMediaUseCase,
    GetAllProfileSocialMediasUseCase,
    GetProfileSocialMediasUseCase,
    UpdateProfileSocialMediaUseCase,
    RemoveProfileSocialMediaUseCase,
  ],
  exports: [
    ProfilesRepository,
    ProfileAddressesRepository,
    ProfileSocialMediaRepository,
  ],
})
export class ProfilesModule {}
