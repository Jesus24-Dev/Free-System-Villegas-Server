import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class CreateAthleteRegisterDto {
  @ApiProperty({
    description: 'ID único del atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El id del atleta debe ser un UUID valido' })
  @IsNotEmpty({ message: 'El id del atleta es obligatorio ' })
  athlete_id!: string;

  @ApiProperty({
    description: 'ID único del gimnasio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El id de la competencia debe ser un UUID valido' })
  @IsNotEmpty({ message: 'El id de la competencia es obligatorio ' })
  competition_id!: string;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único del registro del atleta en la competencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

export class AthleteRegisterResponseDto extends IntersectionType(
  CreateAthleteRegisterDto,
  DatabaseGeneratedFields,
) {}
