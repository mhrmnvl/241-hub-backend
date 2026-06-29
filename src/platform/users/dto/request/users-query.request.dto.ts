import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto.js';

export class UserQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by organization ID' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Filter by school unit ID' })
  @IsOptional()
  @IsUUID()
  schoolUnitId?: string;
}
