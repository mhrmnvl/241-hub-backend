import { ApiPropertyOptional } from '@nestjs/swagger';
import { AchievementType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class AchievementQueryDto {
  @ApiPropertyOptional({ description: 'Filter by profile ID' })
  @IsOptional()
  @IsUUID()
  profileId?: string;

  @ApiPropertyOptional({ enum: AchievementType })
  @IsOptional()
  @IsEnum(AchievementType)
  type?: AchievementType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
