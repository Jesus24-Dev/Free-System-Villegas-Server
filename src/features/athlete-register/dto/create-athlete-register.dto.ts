import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateAthleteRegisterDto {
  @IsUUID()
  @IsNotEmpty()
  athlete_id!: string;

  @IsUUID()
  @IsNotEmpty()
  competition_id!: string;
}
