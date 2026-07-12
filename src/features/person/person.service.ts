import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Person } from '@prisma/client';
import { CreatePersonDto, UpdatePersonDto } from './dto/request';
import { PersonFoundedResponseDto } from './dto/response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data: createPersonDto });
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Person>> {
    const { skip, limit, page } = pagination;
    const where = { deleted_at: null };
    const [data, total] = await Promise.all([
      this.prisma.person.findMany({ where, skip, take: limit }),
      this.prisma.person.count({ where }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.prisma.person.findFirst({
      where: { id, deleted_at: null },
    });
    if (!person) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
    return person;
  }

  async checkIfPersonByDnyExists(
    dni: string,
  ): Promise<PersonFoundedResponseDto | null> {
    const person = await this.prisma.person.findFirst({
      where: { dni, deleted_at: null },
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
        coach: {
          select: {
            id: true,
            gym_id: true,
            gym_owned: {
              select: { id: true },
            },
          },
        },
        athlete: {
          select: {
            id: true,
            gym_id: true,
          },
        },
      },
    });

    if (!person) {
      return null;
    }

    const role = person.user?.role?.[0] ?? null;

    let hasGym = false;
    let ownsGym = false;

    if (role === 'ATHLETE' && person.athlete) {
      hasGym = !!person.athlete.gym_id;
    } else if (role === 'COACH' && person.coach) {
      ownsGym = !!person.coach.gym_owned;
      hasGym = !!person.coach.gym_id || ownsGym;
    }

    return {
      id: person.id,
      dni: person.dni,
      name: person.name,
      surname: person.surname,
      user_id: person.user?.id ?? null,
      roles: person.user?.role ?? null,
      athlete_id: person.athlete?.id ?? null,
      coach_id: person.coach?.id ?? null,
      has_gym: hasGym,
      owns_gym: ownsGym,
    };
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.person.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
