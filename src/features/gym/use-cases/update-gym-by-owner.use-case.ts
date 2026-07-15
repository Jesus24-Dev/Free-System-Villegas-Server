import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gym } from '@prisma/client';
import { UpdateGymByOwnerDto } from '../dto/request';

@Injectable()
export class UpdateGymByOwnerUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    gymId: string,
    userId: string,
    dto: UpdateGymByOwnerDto,
  ): Promise<Gym> {
    const gym = await this.prisma.gym.findFirst({
      where: { id: gymId, deleted_at: null },
      select: { id: true, owner_id: true },
    });

    if (!gym) {
      throw new NotFoundException(
        `El gimnasio con la ID ${gymId} no fue encontrado.`,
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

    if (gym.owner_id !== ownerCoach.id) {
      throw new ForbiddenException(
        `No eres el dueno del gimnasio con la ID ${gymId}.`,
      );
    }

    return this.prisma.gym.update({
      where: { id: gymId },
      data: dto,
    });
  }
}
