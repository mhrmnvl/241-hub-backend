import { ApiPropertyOptional } from '@nestjs/swagger';
import { AcademicCalendarType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class AcademicCalendarQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by academic year ID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @ApiPropertyOptional({ description: 'Filter by semester ID', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  semesterId?: string;

  @ApiPropertyOptional({ enum: AcademicCalendarType })
  @IsOptional()
  @IsEnum(AcademicCalendarType)
  type?: AcademicCalendarType;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 50;
}
