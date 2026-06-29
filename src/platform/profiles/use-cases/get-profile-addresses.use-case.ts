import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from '../index.js';
import { ProfileAddressesRepository } from '../repositories/profile-addresses.repository.js';

@Injectable()
export class GetProfileAddressesUseCase {
  constructor(
    private readonly profileRepo: ProfilesRepository,
    private readonly addressRepo: ProfileAddressesRepository,
  ) {}

  async execute(userId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile)
      throw new NotFoundException(`Profile for user ID ${userId} not found`);
    return this.addressRepo.findAllByUserId(userId);
  }
}
