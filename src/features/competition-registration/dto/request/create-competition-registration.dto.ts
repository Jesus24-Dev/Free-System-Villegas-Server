import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetitionRegistrationDto {
  @ApiProperty({
    description: 'ID único del atleta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El id del atleta debe ser un UUID valido' })
  @IsNotEmpty({ message: 'El id del atleta es obligatorio ' })
  athlete_id!: string;

  @ApiProperty({
    description: 'ID único de la división de competencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El id de la division debe ser un UUID valido' })
  @IsNotEmpty({ message: 'El id de la division es obligatorio ' })
  division_id!: string;
}
