import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Athlete } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignAthleteToGymUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(athleteId: string, gymId: string): Promise<Athlete> {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id: athleteId, deleted_at: null },
    });

    if (!athlete) {
      throw new NotFoundException(
        `Atleta con id ${athleteId} no fue encontrado`,
      );
    }

    if (athlete.gym_id !== null) {
      throw new ConflictException(
        `Atleta con id ${athleteId} ya está asignado a un gimnasio`,
      );
    }

    const gym = await this.prisma.gym.findFirst({
      where: { id: gymId, deleted_at: null },
    });

    if (!gym) {
      throw new NotFoundException(`Gimnasio con id ${gymId} no fue encontrado`);
    }

    const updatedAthlete = await this.prisma.athlete.update({
      where: { id: athlete.id },
      data: {
        gym_id: gymId,
      },
    });

    return updatedAthlete;
  }
}
