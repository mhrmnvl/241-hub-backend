import { Injectable } from '@nestjs/common';
import { EventQueryDto } from '../dto/event-query.dto.js';
import { EventsRepository } from '../repositories/events.repository.js';

@Injectable()
export class GetEventsUseCase {
  constructor(private readonly repository: EventsRepository) {}

  async execute(query: EventQueryDto, schoolUnitId: string) {
    const { data, total, page, limit } = await this.repository.findAll(
      query,
      schoolUnitId,
    );
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
