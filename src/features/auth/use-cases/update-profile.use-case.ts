import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Person } from '@prisma/client';
import { UpdateProfileDto } from '../dto/request';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<Person> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
      select: { person_id: true },
    });

    if (!user || !user.person_id) {
      throw new NotFoundException(
        `Usuario con ID ${userId} no encontrado o sin persona asociada.`,
      );
    }

    if (dto.dni) {
      const existingPerson = await this.prisma.person.findFirst({
        where: {
          dni: dto.dni,
          deleted_at: null,
          id: { not: user.person_id },
        },
        select: { id: true },
      });

      if (existingPerson) {
        throw new ConflictException(
          `La cédula ${dto.dni} ya está registrada por otro usuario.`,
        );
      }
    }

    return this.prisma.person.update({
      where: { id: user.person_id },
      data: dto,
    });
  }
}
