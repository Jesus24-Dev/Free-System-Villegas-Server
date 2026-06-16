import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionRegistrationDto } from './dto/create-competition-registration.dto';
import { UpdateCompetitionRegistrationDto } from './dto/update-competition-registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompetitionRegistration } from 'src/generated/prisma/client';

@Injectable()
export class CompetitionRegistrationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCompetitionRegistrationDto: CreateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistration> {
    return this.prisma.competitionRegistration.create({
      data: createCompetitionRegistrationDto,
    });
  }

  async findAll(): Promise<CompetitionRegistration[]> {
    return this.prisma.competitionRegistration.findMany();
  }

  async findOne(id: string): Promise<CompetitionRegistration> {
    const athleteRegistration =
      await this.prisma.competitionRegistration.findUnique({
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
    updateCompetitionRegistrationDto: UpdateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistration> {
    return this.prisma.competitionRegistration.update({
      where: { id },
      data: updateCompetitionRegistrationDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.competitionRegistration.delete({
      where: { id },
    });
  }
}
