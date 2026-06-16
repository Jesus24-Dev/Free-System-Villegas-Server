import { PartialType } from '@nestjs/mapped-types';
import { CreateCompetitionRegistrationDto } from './create-competition-registration.dto';

export class UpdateCompetitionRegistrationDto extends PartialType(
  CreateCompetitionRegistrationDto,
) {}
