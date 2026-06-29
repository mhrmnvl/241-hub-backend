import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from '../../../shared/dto/address.dto.js';
import { StudentAddressesRepository } from '../repositories/student-addresses.repository.js';
import { StudentsRepository } from '../index.js';

@Injectable()
export class AddStudentAddressUseCase {
  private readonly logger = new Logger(AddStudentAddressUseCase.name);

  constructor(
    private readonly repo: StudentsRepository,
    private readonly addressRepo: StudentAddressesRepository,
  ) {}

  async execute(studentId: string, dto: CreateAddressDto) {
    const student = await this.repo.findById(studentId);
    if (!student)
      throw new NotFoundException(`Student with ID ${studentId} not found`);

    if (dto.isPrimary) await this.addressRepo.clearPrimary(studentId);

    const address = await this.addressRepo.create(studentId, dto);
    this.logger.log(`Address added to student ${studentId}`);
    return address;
  }
}
