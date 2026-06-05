import { PartialType } from '@nestjs/mapped-types';
import { CreateAthleteRegisterDto } from './create-athlete-register.dto';

export class UpdateAthleteRegisterDto extends PartialType(CreateAthleteRegisterDto) {}
