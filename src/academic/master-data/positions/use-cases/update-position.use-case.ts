import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePositionDto } from '../dto/update-position.dto.js';
import { PositionsRepository } from '../repositories/positions.repository.js';

@Injectable()
export class UpdatePositionUseCase {
  private readonly logger = new Logger(UpdatePositionUseCase.name);

  constructor(private readonly repo: PositionsRepository) {}

  async execute(id: string, dto: UpdatePositionDto) {
    const existing = await this.repo.findById(id);
    if (!existing)
      throw new NotFoundException(`Position with ID ${id} not found`);

    if (dto.name) {
      const duplicate = await this.repo.findByName(dto.name, id);
      if (duplicate)
        throw new ConflictException(
          `Position name "${dto.name}" is already taken`,
        );
    }

    const position = await this.repo.update(id, dto);
    this.logger.log(`Position updated: ${id}`);
    return position;
  }
}
