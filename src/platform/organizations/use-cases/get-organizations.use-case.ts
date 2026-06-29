import { Injectable } from '@nestjs/common';
import { OrganizationsRepository } from '../repositories/organizations.repository.js';

@Injectable()
export class GetOrganizationsUseCase {
  constructor(private readonly repo: OrganizationsRepository) {}

  async execute() {
    return this.repo.findMany();
  }
}
