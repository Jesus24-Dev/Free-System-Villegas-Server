import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GymResponseDto, UserResponseDto } from './dto/response';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllGyms(): Promise<GymResponseDto[]> {
    const gyms = await this.prisma.gym.findMany({
      where: { deleted_at: null },
      include: {
        coach_owner: {
          include: {
            person: true,
          },
        },
        coaches: true,
        athletes: true,
      },
    });

    const gymsToResponse: GymResponseDto[] = gyms.map((gym) => ({
      id: gym.id,
      name: gym.name,
      address: gym.address,
      state: gym.state,
      owner_name: `${gym.coach_owner.person.name} ${gym.coach_owner.person.surname}`,
      total_athletes: gym.athletes.length,
      total_coaches: gym.coaches.length,
    }));

    return gymsToResponse;
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { deleted_at: null },
      include: {
        person: true,
      },
    });

    const usersToResponse: UserResponseDto[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      dni: user.person.dni,
      name: user.person.name,
      surname: user.person.surname,
      birthday: user.person.birthday,
      gender: user.person.gender,
      status: user.person.status,
    }));

    return usersToResponse;
  }

  async changeUserStatus(id: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id, deleted_at: null },
      include: {
        person: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    await this.prisma.person.update({
      where: { id: user.person_id },
      data: { status: !user.person.status },
    });
  }
}
