import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantStatus } from '@prisma/client';

export class TenantResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'yayasan-siakad' })
  slug!: string;

  @ApiProperty({ example: 'Yayasan Siakad Indonesia' })
  name!: string;

  @ApiProperty({ format: 'uuid' })
  planId!: string;

  @ApiProperty({ enum: TenantStatus, example: 'ACTIVE' })
  status!: TenantStatus;

  @ApiPropertyOptional()
  trialEndsAt!: Date | null;

  @ApiPropertyOptional()
  subscriptionEndsAt!: Date | null;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logoUrl!: string | null;

  @ApiPropertyOptional({ example: '#3b82f6' })
  primaryColor!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
