import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller.js';
import { UsersRepository } from './repositories/users.repository.js';
import { CreateUserUseCase } from './use-cases/create-user.use-case.js';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case.js';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case.js';
import { GetUsersUseCase } from './use-cases/get-users.use-case.js';
import { UpdateUserUseCase } from './use-cases/update-user.use-case.js';

@Module({
  controllers: [UsersController],
  providers: [
    UsersRepository,
    GetUsersUseCase,
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
