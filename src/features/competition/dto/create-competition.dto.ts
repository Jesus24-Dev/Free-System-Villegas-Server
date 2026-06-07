import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCompetitionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  inscription_begin_at!: Date;

  @Transform(({ value }: { value: string }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  inscription_end_at!: Date;
}
