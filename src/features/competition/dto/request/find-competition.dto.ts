import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { CompetitionStatus } from '@prisma/client';

export class FindCompetitionDto {
  @ApiPropertyOptional({
    description: 'Modo de pelea del competidor',
    enum: CompetitionStatus,
    example: CompetitionStatus.OPEN,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    const val = value as unknown;
    return typeof val === 'string' ? val.toUpperCase() : val;
  })
  @IsEnum(CompetitionStatus, {
    message: 'El estado debe ser valido: DRAFT, OPEN, CLOSED, FINISHED',
  })
  status?: CompetitionStatus;
}
