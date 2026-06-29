import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  schoolUnitId!: string | null;

  @ApiPropertyOptional({ format: 'uuid' })
  categoryId!: string | null;

  @ApiPropertyOptional({ format: 'uuid' })
  uploadedBy!: string | null;

  @ApiProperty({ example: '12345-photo.jpg' })
  filename!: string;

  @ApiProperty({ example: 'photo.jpg' })
  originalName!: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType!: string;

  @ApiProperty({ example: 102400 })
  sizeBytes!: number;

  @ApiProperty({ example: 'organizations/123/files/12345-photo.jpg' })
  storageKey!: string;

  @ApiProperty()
  createdAt!: Date;
}
