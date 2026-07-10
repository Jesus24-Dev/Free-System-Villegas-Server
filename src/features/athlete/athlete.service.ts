import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAthleteDto } from './dto/request/create-athlete.dto';
import { UpdateAthleteDto } from './dto/request/update-athlete.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Athlete,
  CompetitionStatus,
  FightingCategory,
  FightingMode,
  Gender,
  Prisma,
  States,
} from '@prisma/client';
import { AthleteDto } from './dto/response';
import { AthleteProfileResponseDto } from './dto/response/athlete-profile-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export type AthleteWithPerson = Prisma.AthleteGetPayload<{
  include: { person: true };
}>;

interface AthleteProfileData {
  id: string;
  person: {
    dni: string;
    name: string;
    surname: string;
    birthday: Date;
    gender: Gender;
  };
  gym: {
    name: string;
    address: string;
    state: States;
    monthly_payment: number;
  } | null;
  payments_gym: {
    day_payed: Date;
    amount: number;
    payment_reference: string;
    isConfirmed: boolean;
  }[];
  registrations: {
    division: {
      mode: FightingMode;
      category: FightingCategory;
      weight: number;
      competition: {
        name: string;
        status: CompetitionStatus;
      };
    };
  }[];
}
@Injectable()
export class AthleteService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveUserToAthlete(
    userId: string,
  ): Promise<AthleteProfileData> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
      select: { person_id: true },
    });

    if (!user || !user.person_id) {
      throw new NotFoundException(
        `No se encontro un atleta asociado al usuario con ID ${userId}.`,
      );
    }

    const athlete = await this.prisma.athlete.findFirst({
      where: { person_id: user.person_id, deleted_at: null },
      include: {
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            birthday: true,
            gender: true,
          },
        },
        gym: {
          where: { deleted_at: null },
          select: {
            name: true,
            address: true,
            state: true,
            monthly_payment: true,
          },
        },
        payments_gym: {
          where: { deleted_at: null },
          select: {
            day_payed: true,
            amount: true,
            payment_reference: true,
            isConfirmed: true,
          },
        },
        registrations: {
          where: { deleted_at: null },
          include: {
            division: {
              select: {
                mode: true,
                category: true,
                weight: true,
                competition: {
                  select: {
                    name: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!athlete) {
      throw new NotFoundException(
        `No se encontro un atleta asociado al usuario con ID ${userId}.`,
      );
    }

    return athlete;
  }

  private async resolvePersonToAthlete(
    personId: string,
  ): Promise<AthleteWithPerson> {
    const athlete = await this.prisma.athlete.findFirst({
      where: { person_id: personId, deleted_at: null },
      include: { person: true },
    });

    if (!athlete) {
      throw new NotFoundException(
        `No se encontro un atleta asociado a la persona con ID ${personId}.`,
      );
    }

    return athlete;
  }

  async create(createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    return this.prisma.athlete.create({
      data: createAthleteDto,
    });
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<AthleteWithPerson>> {
    const { skip, limit, page } = pagination;
    const where = { deleted_at: null };
    const [data, total] = await Promise.all([
      this.prisma.athlete.findMany({
        where,
        include: { person: true },
        skip,
        take: limit,
      }),
      this.prisma.athlete.count({ where }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findOne(personId: string): Promise<AthleteWithPerson> {
    return this.resolvePersonToAthlete(personId);
  }

  async findAllAthletesByGym(gymId: string): Promise<AthleteDto[]> {
    const athletes = await this.prisma.athlete.findMany({
      where: { gym_id: gymId, deleted_at: null },
      select: {
        id: true,
        person_id: true,
        gym_id: true,
        created_at: true,
        updated_at: true,
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            gender: true,
            birthday: true,
            status: true,
          },
        },
      },
    });

    return athletes.map((athlete) => ({
      id: athlete.id,
      person_id: athlete.person_id,
      gym_id: athlete.gym_id,
      dni: athlete.person.dni,
      name: athlete.person.name,
      surname: athlete.person.surname,
      gender: athlete.person.gender,
      birthday: athlete.person.birthday,
      status: athlete.person.status,
      created_at: athlete.created_at,
      updated_at: athlete.updated_at,
    }));
  }

  async findAthleteProfile(id: string): Promise<AthleteProfileResponseDto> {
    let athlete: AthleteProfileData | null = null;

    // Intentar resolver como athlete ID directamente
    const directAthlete = await this.prisma.athlete.findFirst({
      where: { id, deleted_at: null },
      include: {
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            birthday: true,
            gender: true,
          },
        },
        gym: {
          where: { deleted_at: null },
          select: {
            name: true,
            address: true,
            state: true,
            monthly_payment: true,
          },
        },
        payments_gym: {
          where: { deleted_at: null },
          select: {
            day_payed: true,
            amount: true,
            payment_reference: true,
            isConfirmed: true,
          },
        },
        registrations: {
          where: { deleted_at: null },
          include: {
            division: {
              select: {
                mode: true,
                category: true,
                weight: true,
                competition: {
                  select: {
                    name: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (directAthlete) {
      athlete = directAthlete;
    } else {
      // Si no se encontro como athlete, intentar como user ID
      try {
        athlete = await this.resolveUserToAthlete(id);
      } catch {
        throw new NotFoundException(
          `No se encontro perfil de atleta para el ID ${id}.`,
        );
      }
    }

    if (!athlete) {
      throw new NotFoundException(
        `No se encontro perfil de atleta para el ID ${id}.`,
      );
    }

    return {
      id: athlete.id,
      personal: {
        dni: athlete.person.dni,
        name: athlete.person.name,
        surname: athlete.person.surname,
        birthday: athlete.person.birthday,
        gender: athlete.person.gender,
      },
      gym: {
        name: athlete.gym?.name,
        address: athlete.gym?.address,
        state: athlete.gym?.state,
        monthly_payment: athlete.gym?.monthly_payment,
      },
      payments: athlete.payments_gym.map(
        (payment: {
          day_payed: Date;
          amount: number;
          payment_reference: string;
          isConfirmed: boolean;
        }) => ({
          date: payment.day_payed,
          amount: payment.amount,
          reference: payment.payment_reference,
          confirmed: payment.isConfirmed,
        }),
      ),
      competitions: athlete.registrations.map(
        (registration: {
          division: {
            competition: { name: string; status: CompetitionStatus };
            mode: FightingMode;
            category: FightingCategory;
            weight: number;
          };
        }) => ({
          competition: registration.division.competition.name,
          status: registration.division.competition.status,
          division: {
            mode: registration.division.mode,
            category: registration.division.category,
            weight: registration.division.weight,
          },
        }),
      ),
    };
  }

  async update(
    personId: string,
    updateAthleteDto: UpdateAthleteDto,
  ): Promise<Athlete> {
    const athlete = await this.resolvePersonToAthlete(personId);
    return this.prisma.athlete.update({
      where: { id: athlete.id },
      data: updateAthleteDto,
    });
  }

  async remove(personId: string): Promise<void> {
    const athlete = await this.resolvePersonToAthlete(personId);
    await this.prisma.athlete.update({
      where: { id: athlete.id },
      data: { deleted_at: new Date() },
    });
  }
}
