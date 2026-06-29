import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  tenantId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  typeId!: string | null;

  @ApiProperty({ example: 'Yayasan Al-Ikhlash' })
  name!: string;

  @ApiProperty({ example: 'al-ikhlash' })
  code!: string;

  @ApiPropertyOptional({ example: 'info@al-ikhlash.org' })
  email!: string | null;

  @ApiPropertyOptional({ example: '08123456789' })
  phoneNumber!: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
