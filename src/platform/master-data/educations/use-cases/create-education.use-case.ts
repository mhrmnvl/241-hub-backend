import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateEducationDto } from '../dto/create-education.dto.js';
import { EducationsRepository } from '../repositories/educations.repository.js';

@Injectable()
export class CreateEducationUseCase {
  private readonly logger = new Logger(CreateEducationUseCase.name);

  constructor(private readonly repository: EducationsRepository) {}

  async execute(dto: CreateEducationDto) {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Education with name "${dto.name}" already exists`,
      );
    }

    const education = await this.repository.create({
      name: dto.name,
      isActive: dto.isActive,
    });

    this.logger.log(`Education created: ${education.name}`);
    return education;
  }
}
