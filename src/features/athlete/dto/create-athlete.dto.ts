import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
export class CreateAthleteDto {
  @ApiProperty({
    description: 'ID único de la persona a relacionar con el atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Person id debe ser un UUID valido' })
  @IsNotEmpty({ message: 'Person ID no debe estar vacio' })
  person_id!: string;

  @ApiProperty({
    description: 'ID único del gimnasio al que pertenece el atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Gym id debe ser un UUID valido' })
  @IsNotEmpty({ message: 'Gym ID no debe estar vacio' })
  gym_id!: string;
}

export class DatabaseGeneratedFields {
  @ApiProperty({
    description: 'ID único del atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;
  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  created_at!: Date;

  @ApiProperty({ example: '2026-06-06T21:50:00.000Z' })
  updated_at!: Date;
}

export class AthleteResponseDto extends IntersectionType(
  CreateAthleteDto,
  DatabaseGeneratedFields,
) {}
