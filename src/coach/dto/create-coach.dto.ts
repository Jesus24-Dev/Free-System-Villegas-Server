import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCoachDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Person ID no debe estar vacio' })
  person_id!: string;
  @IsUUID()
  @IsNotEmpty({ message: 'Gym ID no debe estar vacio' })
  gym_id!: string;
}
