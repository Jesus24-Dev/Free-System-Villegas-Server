import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAthleteDto } from './dto/request/create-athlete.dto';
import { UpdateAthleteDto } from './dto/request/update-athlete.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Athlete, Prisma } from '@prisma/client';
import { AthleteDto } from './dto/response';
import { AthleteProfileResponseDto } from './dto/response/athlete-profile-response.dto';

export type AthleteWithPerson = Prisma.AthleteGetPayload<{
  include: { person: true };
}>;
@Injectable()
export class AthleteService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    return this.prisma.athlete.create({
      data: createAthleteDto,
    });
  }

  async findAll(): Promise<AthleteWithPerson[]> {
    return this.prisma.athlete.findMany({
      where: { deleted_at: null },
      include: { person: true },
    });
  }

  async findOne(id: string): Promise<AthleteWithPerson> {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id, deleted_at: null },
      include: { person: true },
    });

    if (!athlete) {
      throw new NotFoundException(
        `El atleta con la ID ${id} no fue encontrado.`,
      );
    }

    return athlete;
  }

  async findAllAthletesByGym(gymId: string): Promise<AthleteDto[]> {
    const athletes = await this.prisma.athlete.findMany({
      where: { gym_id: gymId, deleted_at: null },
      include: {
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
      ...athlete.person,
    }));
  }

  async findAthleteProfile(id: string): Promise<AthleteProfileResponseDto> {
    const athlete = await this.prisma.athlete.findFirst({
      where: { id, deleted_at: null },
      include: {
        person: true,
        gym: true,
        payments_gym: true,
        registrations: {
          include: {
            division: {
              include: {
                competition: true,
              },
            },
          },
        },
      },
    });

    if (!athlete) {
      throw new NotFoundException(`Atletla con el ID ${id} no encontrado`);
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
      payments: athlete.payments_gym.map((payment) => ({
        date: payment.day_payed,
        amount: payment.amount,
        reference: payment.payment_reference,
        confirmed: payment.isConfirmed,
      })),
      competitions: athlete.registrations.map((registration) => ({
        competition: registration.division.competition.name,
        status: registration.division.competition.status,
        division: {
          mode: registration.division.mode,
          category: registration.division.category,
          weight: registration.division.weight,
        },
      })),
    };
  }

  async update(
    id: string,
    updateAthleteDto: UpdateAthleteDto,
  ): Promise<Athlete> {
    return this.prisma.athlete.update({
      where: { id },
      data: updateAthleteDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.athlete.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
