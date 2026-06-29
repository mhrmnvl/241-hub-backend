import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateOccupationDto } from '../dto/create-occupation.dto.js';
import { OccupationsRepository } from '../repositories/occupations.repository.js';

@Injectable()
export class CreateOccupationUseCase {
  private readonly logger = new Logger(CreateOccupationUseCase.name);

  constructor(private readonly repo: OccupationsRepository) {}

  async execute(dto: CreateOccupationDto) {
    const existing = await this.repo.findByName(dto.name);
    if (existing)
      throw new ConflictException(
        `Occupation name "${dto.name}" is already taken`,
      );

    const occupation = await this.repo.create(dto);
    this.logger.log(`Occupation created: ${occupation.name}`);
    return occupation;
  }
}
