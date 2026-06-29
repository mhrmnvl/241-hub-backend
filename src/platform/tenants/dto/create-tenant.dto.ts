import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'yayasan-siakad' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug!: string;

  @ApiProperty({ example: 'Yayasan Siakad Indonesia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  @IsNotEmpty()
  planId!: string;

  @ApiPropertyOptional({ enum: TenantStatus, example: 'TRIAL' })
  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional({ example: '#3b82f6' })
  @IsString()
  @IsOptional()
  @MaxLength(7)
  primaryColor?: string;
}
