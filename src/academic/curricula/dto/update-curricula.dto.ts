import { PartialType } from '@nestjs/swagger';
import { CreateCurriculaDto } from './create-curricula.dto.js';

export class UpdateCurriculaDto extends PartialType(CreateCurriculaDto) {}
