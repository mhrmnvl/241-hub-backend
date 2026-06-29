import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/request/create-user.request.dto.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { hashPassword } from '../../../shared/utils/hash.helper.js';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(dto: CreateUserDto) {
    const schoolUnitId = dto.schoolUnitId ?? null;
    const taken = await this.usersRepository.existsByIdentifier(
      dto.identifier,
      schoolUnitId,
    );
    if (taken) {
      throw new ConflictException(
        'Identifier already taken in this school unit',
      );
    }

    const user = await this.usersRepository.create({
      identifier: dto.identifier,
      passwordHash: await hashPassword(dto.password),
      organizationId: dto.organizationId,
      schoolUnitId,
    });

    this.logger.log(`User created: ${dto.identifier}`);
    return user;
  }
}
