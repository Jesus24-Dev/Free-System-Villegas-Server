import { PartialType } from '@nestjs/mapped-types';
import { CreateGymPaymentDto } from './create-gym-payment.dto';

export class UpdateGymPaymentDto extends PartialType(CreateGymPaymentDto) {}
