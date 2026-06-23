import { CompetitionStatus } from '@prisma/client';

export class CompetitionDivisionCompetitionDto {
  name!: string;
  status!: CompetitionStatus;
}
