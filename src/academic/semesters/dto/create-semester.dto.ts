import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SemesterType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateSemesterDto {
  @ApiProperty({
    description: 'Academic Year ID this semester belongs to',
    example: '550e8400-e29b-41d4-a716-446655440009',
  })
  @IsUUID()
  @IsNotEmpty()
  academicYearId: string;

  @ApiProperty({
    description: 'Semester type',
    enum: SemesterType,
    example: SemesterType.GANJIL,
  })
  @IsEnum(SemesterType)
  type: SemesterType;

  @ApiPropertyOptional({
    description: 'Semester start date',
    example: '2025-07-14',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Semester end date',
    example: '2025-12-20',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Is current active semester?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
