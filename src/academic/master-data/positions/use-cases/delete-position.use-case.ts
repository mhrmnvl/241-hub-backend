import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PositionsRepository } from '../repositories/positions.repository.js';

@Injectable()
export class DeletePositionUseCase {
  private readonly logger = new Logger(DeletePositionUseCase.name);

  constructor(private readonly repo: PositionsRepository) {}

  async execute(id: string): Promise<void> {
    const [position, inUse] = await Promise.all([
      this.repo.findById(id),
      this.repo.countActiveAssignments(id),
    ]);

    if (!position)
      throw new NotFoundException(`Position with ID ${id} not found`);

    if (inUse > 0)
      throw new ConflictException(
        `Position is still assigned to ${inUse} teacher(s) and cannot be deleted`,
      );

    await this.repo.remove(id);
    this.logger.log(`Position deleted: ${id}`);
  }
}
