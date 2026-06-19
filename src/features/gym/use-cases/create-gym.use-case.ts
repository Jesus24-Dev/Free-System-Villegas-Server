import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGymDto } from '../dto/request';
import { RawGymDto } from '../dto/response';

@Injectable()
export class CreateGymUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, createGym: CreateGymDto): Promise<RawGymDto> {
    const coach = await this.prisma.coach.findFirst({
      where: {
        person: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (!coach) {
      throw new ForbiddenException(
        'Solo los entrenadores pueden crear gimnasios',
      );
    }
    return this.prisma.gym.create({
      data: {
        owner_id: coach.id,
        ...createGym,
      },
    });
  }
}
