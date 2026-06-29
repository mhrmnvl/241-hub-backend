import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository.js';
import { UserQueryDto } from '../dto/request/users-query.request.dto.js';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: UserQueryDto) {
    const { data, total, page, limit } =
      await this.usersRepository.findAll(query);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
