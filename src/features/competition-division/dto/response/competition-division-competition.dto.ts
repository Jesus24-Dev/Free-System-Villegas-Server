import { CompetitionStatus } from 'src/generated/prisma/enums';

export class CompetitionDivisionCompetitionDto {
  name!: string;
  status!: CompetitionStatus;
}
