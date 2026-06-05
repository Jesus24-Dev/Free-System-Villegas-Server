import { PartialType } from '@nestjs/mapped-types';
import { CreateFightModeDto } from './create-fight-mode.dto';

export class UpdateFightModeDto extends PartialType(CreateFightModeDto) {}
