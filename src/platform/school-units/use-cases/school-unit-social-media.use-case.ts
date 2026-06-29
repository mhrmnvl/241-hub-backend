import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSchoolUnitSocialMediaDto,
  UpdateSchoolUnitSocialMediaDto,
} from '../dto/school-unit-social-media.dto.js';
import { SchoolUnitSocialMediaRepository } from '../repositories/school-unit-social-media.repository.js';
import { SchoolUnitsRepository } from '../repositories/school-units.repository.js';

@Injectable()
export class SchoolUnitSocialMediaUseCase {
  private readonly logger = new Logger(SchoolUnitSocialMediaUseCase.name);

  constructor(
    private readonly schoolUnitsRepo: SchoolUnitsRepository,
    private readonly repo: SchoolUnitSocialMediaRepository,
  ) {}

  async findAll(schoolUnitId: string) {
    await this.requireSchoolUnitId(schoolUnitId);
    return this.repo.findAll(schoolUnitId);
  }

  async create(schoolUnitId: string, dto: CreateSchoolUnitSocialMediaDto) {
    await this.requireSchoolUnitId(schoolUnitId);

    const existing = await this.repo.findByPlatform(
      schoolUnitId,
      dto.socialMediaId,
    );
    if (existing) {
      throw new ConflictException(
        `Platform ${dto.socialMediaId} is already linked to this school unit`,
      );
    }

    const socialMedia = await this.repo.create(schoolUnitId, dto);
    this.logger.log(
      `Social media added: platform ${dto.socialMediaId} for school unit ${schoolUnitId}`,
    );
    return socialMedia;
  }

  async update(
    schoolUnitId: string,
    id: string,
    dto: UpdateSchoolUnitSocialMediaDto,
  ) {
    await this.requireSchoolUnitId(schoolUnitId);
    const socialMedia = await this.repo.findById(id, schoolUnitId);
    if (!socialMedia) {
      throw new NotFoundException(`Social media with ID ${id} not found`);
    }

    return this.repo.update(id, dto);
  }

  async remove(schoolUnitId: string, id: string): Promise<void> {
    await this.requireSchoolUnitId(schoolUnitId);
    const socialMedia = await this.repo.findById(id, schoolUnitId);
    if (!socialMedia) {
      throw new NotFoundException(`Social media with ID ${id} not found`);
    }

    await this.repo.remove(id);
    this.logger.log(`Social media ${id} removed`);
  }

  private async requireSchoolUnitId(schoolUnitId: string): Promise<string> {
    const schoolUnit = await this.schoolUnitsRepo.findById(schoolUnitId);
    if (!schoolUnit) {
      throw new NotFoundException('School unit has not been set up yet');
    }
    return schoolUnitId;
  }
}
