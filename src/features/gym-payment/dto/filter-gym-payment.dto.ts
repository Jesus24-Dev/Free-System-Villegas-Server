import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterGymPaymentDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar pagos por ID del gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  gym_id?: string;
}
