import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SchoolUnitStatus } from '@prisma/client';
import { AddressResponseDto } from '../../../shared/dto/address.dto.js';
import { SchoolUnitSocialMediaResponseDto } from './school-unit-social-media-response.dto.js';

export class SchoolUnitResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ example: 'MTs Negeri 1 Kota Malang' })
  name!: string;

  @ApiProperty({ example: 'MTsN 1 Malang' })
  surname!: string;

  @ApiProperty({ example: '121235730001' })
  nsm!: string;

  @ApiProperty({ example: '20518057' })
  npsn!: string;

  @ApiProperty({ enum: SchoolUnitStatus, example: 'PUBLIC' })
  status!: SchoolUnitStatus;

  @ApiPropertyOptional({ format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  typeId!: string | null;

  @ApiProperty({ example: '01.234.567.8-901.000' })
  npwp!: string;

  @ApiProperty({ example: '0341123456' })
  phone!: string;

  @ApiProperty({ example: 'info@mtsn1malang.sch.id' })
  email!: string;

  @ApiProperty({ example: 'https://mtsn1malang.sch.id' })
  website!: string;

  @ApiPropertyOptional({ example: 'mts1' })
  subdomain!: string | null;

  @ApiPropertyOptional({ example: 'mts1.sch.id' })
  customDomain!: string | null;

  @ApiPropertyOptional({ type: () => AddressResponseDto })
  address!: AddressResponseDto | null;

  @ApiPropertyOptional({ type: () => [SchoolUnitSocialMediaResponseDto] })
  socialMedias!: SchoolUnitSocialMediaResponseDto[];
}
