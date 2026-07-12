import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coach } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignCoachToGymUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(coachId: string, gymId: string): Promise<Coach> {
    const coach = await this.prisma.coach.findFirst({
      where: { id: coachId, deleted_at: null },
    });

    if (!coach) {
      throw new NotFoundException(`Coach con id ${coachId} no fue encontrado`);
    }

    if (coach.gym_id !== null) {
      throw new ConflictException(
        `Coach con id ${coachId} ya está asignado a un gimnasio`,
      );
    }

    const gym = await this.prisma.gym.findFirst({
      where: { id: gymId, deleted_at: null },
    });

    if (!gym) {
      throw new NotFoundException(`Gimnasio con id ${gymId} no fue encontrado`);
    }

    const updatedCoach = await this.prisma.coach.update({
      where: { id: coach.id },
      data: {
        gym_id: gymId,
      },
    });

    return updatedCoach;
  }
}
