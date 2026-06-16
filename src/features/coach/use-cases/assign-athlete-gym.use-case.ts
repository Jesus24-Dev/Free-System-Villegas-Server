import { Injectable, NotFoundException } from '@nestjs/common';
import { Athlete } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignAthleteToGymUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(athleteId: string, gymId: string): Promise<Athlete> {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id: athleteId },
    });

    if (!athlete) {
      throw new NotFoundException(
        `Atleta con id ${athleteId} no fue encontrado`,
      );
    }
    await this.prisma.athlete.update({
      where: { id: athlete.id },
      data: {
        gym_id: gymId,
      },
    });

    return athlete;
  }
}
