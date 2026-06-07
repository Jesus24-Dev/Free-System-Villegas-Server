import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsNumber,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGymPaymentDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  day_payed!: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsNotEmpty()
  amount!: number;

  @IsUrl()
  @IsOptional()
  evidence_url?: string;

  @IsString()
  @IsNotEmpty()
  payment_reference!: string;

  @IsUUID()
  @IsNotEmpty()
  athlete_id!: string;

  @IsUUID()
  @IsNotEmpty()
  gym_id!: string;
}
