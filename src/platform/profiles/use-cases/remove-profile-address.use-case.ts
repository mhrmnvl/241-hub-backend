import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from '../index.js';
import { ProfileAddressesRepository } from '../repositories/profile-addresses.repository.js';

@Injectable()
export class RemoveProfileAddressUseCase {
  private readonly logger = new Logger(RemoveProfileAddressUseCase.name);

  constructor(
    private readonly profileRepo: ProfilesRepository,
    private readonly addressRepo: ProfileAddressesRepository,
  ) {}

  async execute(userId: string, addressId: string): Promise<void> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile)
      throw new NotFoundException(`Profile for user ID ${userId} not found`);

    const address = await this.addressRepo.findAddressForUser(
      addressId,
      userId,
    );
    if (!address)
      throw new NotFoundException(
        `Address with ID ${addressId} not found for this profile`,
      );

    await this.addressRepo.remove(addressId);
    this.logger.log(`Address ${addressId} removed for user ${userId}`);
  }
}
