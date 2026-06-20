import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gym } from 'src/generated/prisma/client';
import { GymDto } from './dto/response';
import { CreateGymDto, UpdateGymDto } from './dto/request';

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

  async findAll(): Promise<GymDto[]> {
    const gyms = await this.prisma.gym.findMany({
      include: {
        coach_owner: {
          include: {
            person: {
              select: {
                dni: true,
                name: true,
                surname: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return gyms.map((gym) => ({
      id: gym.id,
      name: gym.name,
      address: gym.address,
      state: gym.state,
      monthly_payment: gym.monthly_payment,
      owner: {
        id: gym.coach_owner.id,
        name: gym.coach_owner.person.name,
        surname: gym.coach_owner.person.surname,
        status: gym.coach_owner.person.status,
      },
    }));
  }

  async findOne(id: string): Promise<GymDto> {
    const gym = await this.prisma.gym.findUnique({
      where: { id },
      include: {
        coach_owner: {
          include: {
            person: {
              select: {
                dni: true,
                name: true,
                surname: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!gym) {
      throw new NotFoundException(
        `El gimnasio con la ID ${id} no fue encontrado.`,
      );
    }

    return {
      id: gym.id,
      name: gym.name,
      address: gym.address,
      state: gym.state,
      monthly_payment: gym.monthly_payment,
      owner: {
        id: gym.coach_owner.id,
        name: gym.coach_owner.person.name,
        surname: gym.coach_owner.person.surname,
        status: gym.coach_owner.person.status,
      },
    };
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
