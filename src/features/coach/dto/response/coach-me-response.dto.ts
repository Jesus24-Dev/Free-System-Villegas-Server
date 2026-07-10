import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class CoachMePersonDto {
  @ApiProperty({ example: '12345678' })
  dni!: string;

  @ApiProperty({ example: 'John' })
  name!: string;

  @ApiProperty({ example: 'Doe' })
  surname!: string;

  @ApiProperty({ example: 'MALE', enum: Gender })
  gender!: Gender;

  @ApiProperty({ example: '1990-01-01' })
  birthday!: Date;

  @ApiProperty({ example: true })
  status!: boolean;
}

export class CoachMeResponseDto {
  @ApiProperty({
    description: 'ID único del Coach',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la persona asociada al coach',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  person_id!: string;

  @ApiProperty({
    description: 'ID del gimnasio al que pertenece el coach',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  gym_id!: string | null;

  @ApiProperty({ type: CoachMePersonDto })
  person!: CoachMePersonDto;
}
