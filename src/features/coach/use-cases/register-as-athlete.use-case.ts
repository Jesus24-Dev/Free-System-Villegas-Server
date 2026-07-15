import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class RegisterAsAthleteUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
      select: { id: true, person_id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${userId} no fue encontrado.`,
      );
    }

    if (!user.person_id) {
      throw new NotFoundException(
        `Usuario con ID ${userId} no tiene una persona asociada.`,
      );
    }

    const coach = await this.prisma.coach.findFirst({
      where: { person_id: user.person_id, deleted_at: null },
      select: { id: true, gym_id: true },
    });

    if (!coach) {
      throw new NotFoundException(
        `No se encontro un coach asociado al usuario con ID ${userId}.`,
      );
    }

    if (user.role.includes('ATHLETE')) {
      throw new ConflictException(
        `El usuario con ID ${userId} ya tiene el rol ATHLETE.`,
      );
    }

    const existingAthlete = await this.prisma.athlete.findFirst({
      where: { person_id: user.person_id, deleted_at: null },
      select: { id: true },
    });

    if (existingAthlete) {
      throw new ConflictException(
        `Ya existe un registro de atleta para el usuario con ID ${userId}.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.athlete.create({
        data: {
          person_id: user.person_id,
          gym_id: coach.gym_id,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          role: [...user.role, 'ATHLETE'],
        },
      });

      return updatedUser;
    });
  }
}
