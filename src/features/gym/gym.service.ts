import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gym } from 'src/generated/prisma/client';

@Injectable()
export class GymService {
  constructor(private readonly prisma: PrismaService) {}
  async create(ownerId: string, createGymDto: CreateGymDto): Promise<Gym> {
    return this.prisma.gym.create({
      data: {
        owner_id: ownerId,
        ...createGymDto,
      },
    });
  }

  async findAll(): Promise<Gym[]> {
    return this.prisma.gym.findMany();
  }

  async findOne(id: string): Promise<Gym> {
    const gym = await this.prisma.gym.findUnique({ where: { id } });

    if (!gym) {
      throw new NotFoundException(
        `El gimnasio con la ID ${id} no fue encontrado.`,
      );
    }

    return gym;
  }

  async update(id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
    return this.prisma.gym.update({
      where: { id },
      data: updateGymDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.gym.delete({ where: { id } });
  }
}
