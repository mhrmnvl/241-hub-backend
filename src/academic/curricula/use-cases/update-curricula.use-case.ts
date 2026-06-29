import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearsRepository } from '../../academic-years/index.js';
import { UpdateCurriculaDto } from '../dto/update-curricula.dto.js';
import { CurriculaRepository } from '../repositories/curricula.repository.js';

@Injectable()
export class UpdateCurriculaUseCase {
  private readonly logger = new Logger(UpdateCurriculaUseCase.name);

  constructor(
    private readonly repository: CurriculaRepository,
    private readonly academicYearRepository: AcademicYearsRepository,
  ) {}

  async execute(id: string, dto: UpdateCurriculaDto) {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new NotFoundException(`Curricula with ID ${id} not found`);
    }

    if (dto.academicYearId && dto.academicYearId !== current.academicYearId) {
      const academicYear = await this.academicYearRepository.findById(
        dto.academicYearId,
      );
      if (!academicYear) {
        throw new NotFoundException(
          `Academic Year with ID ${dto.academicYearId} not found`,
        );
      }
    }

    const newAcademicYearId = dto.academicYearId ?? current.academicYearId;
    const newName = dto.name ?? current.name;

    if (
      newAcademicYearId !== current.academicYearId ||
      newName !== current.name
    ) {
      const duplicate = await this.repository.findByNameAndAcademicYear(
        newName,
        newAcademicYearId,
        id,
      );
      if (duplicate) {
        throw new ConflictException(
          `Curricula with name "${newName}" already exists in this academic year`,
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    this.logger.log(`Curricula updated: ${id}`);
    return updated;
  }
}
