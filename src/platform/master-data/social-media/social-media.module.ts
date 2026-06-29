import { Module } from '@nestjs/common';
import { SchoolUnitsModule } from '../../school-units/school-units.module.js';
import { ProfilesModule } from '../../profiles/profiles.module.js';
import { SocialMediaController } from './controllers/social-media.controller.js';
import { SocialMediaRepository } from './repositories/social-media.repository.js';
import { CreateSocialMediaService } from './services/create-social-media.service.js';
import { DeleteSocialMediaService } from './services/delete-social-media.service.js';
import { GetSocialMediaByIdService } from './services/get-social-media-by-id.service.js';
import { GetSocialMediasService } from './services/get-social-medias.service.js';
import { UpdateSocialMediaService } from './services/update-social-media.service.js';

@Module({
  imports: [SchoolUnitsModule, ProfilesModule],
  controllers: [SocialMediaController],
  providers: [
    SocialMediaRepository,
    GetSocialMediasService,
    GetSocialMediaByIdService,
    CreateSocialMediaService,
    UpdateSocialMediaService,
    DeleteSocialMediaService,
  ],
  exports: [SocialMediaRepository],
})
export class SocialMediaModule {}
