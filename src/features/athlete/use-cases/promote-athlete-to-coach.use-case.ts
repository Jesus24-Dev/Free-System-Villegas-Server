import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class PromoteAthleteToCoachUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    athleteId: string,
    userId: string,
    userRoles: string[],
  ): Promise<User> {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id: athleteId, deleted_at: null },
      select: { id: true, person_id: true, gym_id: true },
    });

    if (!athlete) {
      throw new NotFoundException(
        `Atleta con ID ${athleteId} no fue encontrado.`,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { person_id: athlete.person_id, deleted_at: null },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(
        `El atleta con ID ${athleteId} no tiene una cuenta de usuario asociada.`,
      );
    }

    if (user.role.includes('COACH')) {
      throw new ConflictException(
        `El atleta con ID ${athleteId} ya tiene el rol COACH.`,
      );
    }

    const existingCoach = await this.prisma.coach.findFirst({
      where: { person_id: athlete.person_id, deleted_at: null },
      select: { id: true },
    });

    if (existingCoach) {
      throw new ConflictException(
        `Ya existe un registro de coach para el atleta con ID ${athleteId}.`,
      );
    }

    if (!userRoles.includes('ADMIN')) {
      if (!athlete.gym_id) {
        throw new ForbiddenException(
          `El atleta con ID ${athleteId} no esta asignado a ningun gimnasio.`,
        );
      }

      const authenticatedUser = await this.prisma.user.findFirst({
        where: { id: userId, deleted_at: null },
        select: { person_id: true },
      });

      if (!authenticatedUser || !authenticatedUser.person_id) {
        throw new ForbiddenException(`No se encontro el usuario autenticado.`);
      }

      const ownerCoach = await this.prisma.coach.findFirst({
        where: { person_id: authenticatedUser.person_id, deleted_at: null },
        select: { id: true },
      });

      if (!ownerCoach) {
        throw new ForbiddenException(
          `No se encontro un coach asociado al usuario.`,
        );
      }

      const gym = await this.prisma.gym.findFirst({
        where: { id: athlete.gym_id, deleted_at: null },
        select: { owner_id: true },
      });

      if (!gym || gym.owner_id !== ownerCoach.id) {
        throw new ForbiddenException(
          `No eres el dueno del gimnasio donde esta asignado el atleta.`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.coach.create({
        data: {
          person_id: athlete.person_id,
          gym_id: athlete.gym_id,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          role: [...user.role, 'COACH'],
        },
      });

      return updatedUser;
    });
  }
}
