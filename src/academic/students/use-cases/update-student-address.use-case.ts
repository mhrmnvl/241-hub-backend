import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateAddressDto } from '../../../shared/dto/address.dto.js';
import { StudentAddressesRepository } from '../repositories/student-addresses.repository.js';
import { StudentsRepository } from '../index.js';

@Injectable()
export class UpdateStudentAddressUseCase {
  private readonly logger = new Logger(UpdateStudentAddressUseCase.name);

  constructor(
    private readonly repo: StudentsRepository,
    private readonly addressRepo: StudentAddressesRepository,
  ) {}

  async execute(studentId: string, addressId: string, dto: UpdateAddressDto) {
    const student = await this.repo.findById(studentId);
    if (!student)
      throw new NotFoundException(`Student with ID ${studentId} not found`);

    const address = await this.addressRepo.findOne(studentId, addressId);
    if (!address)
      throw new NotFoundException(
        `Address with ID ${addressId} not found for this student`,
      );

    if (dto.isPrimary)
      await this.addressRepo.clearPrimaryExclude(studentId, addressId);

    const updated = await this.addressRepo.update(addressId, dto);
    this.logger.log(`Address ${addressId} updated for student ${studentId}`);
    return updated;
  }
}
