import { PartialType } from '@nestjs/mapped-types';
import { CreateCompetitionDivisionDto } from './create-competition-division.dto';

export class UpdateCompetitionDivisionDto extends PartialType(
  CreateCompetitionDivisionDto,
) {}
