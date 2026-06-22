import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from 'src/features/person/dto/request/create-person.dto';
import { Athlete } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegisterAthleteUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreatePersonDto, gymId: string): Promise<Athlete> {
    return this.prisma.$transaction(async (tx) => {
      const gym = await tx.gym.findFirst({
        where: { id: gymId },
      });

      if (!gym) {
        throw new NotFoundException(
          `Gimnasio con ID ${gymId} no fue encontrado.`,
        );
      }

      const person = await tx.person.create({
        data: dto,
      });

      const athlete = await tx.athlete.create({
        data: {
          person_id: person.id,
          gym_id: gymId,
        },
      });

      return athlete;
    });
  }
}
