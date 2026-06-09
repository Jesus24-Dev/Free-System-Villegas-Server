import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAthleteRegisterDto } from './dto/create-athlete-register.dto';
import { UpdateAthleteRegisterDto } from './dto/update-athlete-register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Athlete_Registration } from 'src/generated/prisma/client';

@Injectable()
export class AthleteRegisterService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createAthleteRegisterDto: CreateAthleteRegisterDto,
  ): Promise<Athlete_Registration> {
    return this.prisma.athlete_Registration.create({
      data: createAthleteRegisterDto,
    });
  }

  async findAll(): Promise<Athlete_Registration[]> {
    return this.prisma.athlete_Registration.findMany();
  }

  async findOne(id: string): Promise<Athlete_Registration> {
    const athleteRegistration =
      await this.prisma.athlete_Registration.findUnique({
        where: { id },
      });

    if (!athleteRegistration) {
      throw new NotFoundException(
        `El registro del atleta con id ${id} no se pudo encontrar`,
      );
    }

    return athleteRegistration;
  }

  async update(
    id: string,
    updateAthleteRegisterDto: UpdateAthleteRegisterDto,
  ): Promise<Athlete_Registration> {
    return this.prisma.athlete_Registration.update({
      where: { id },
      data: updateAthleteRegisterDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.athlete_Registration.delete({
      where: { id },
    });
  }
}
