import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GymResponseDto, UserResponseDto } from './dto/response';
import { CompetitionService } from '../competition/competition.service';
import { CompetitionDivisionService } from '../competition-division/competition-division.service';
import {
  CreateCompetitionDto,
  FindCompetitionDto,
  UpdateCompetitionDto,
} from '../competition/dto/request';
import { CompetitionDto } from '../competition/dto/response';
import {
  CreateCompetitionDivisionDto,
  UpdateCompetitionDivisionDto,
} from '../competition-division/dto/request';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly competitionService: CompetitionService,
    private readonly competitionDivisionService: CompetitionDivisionService,
  ) {}
  async getAllGyms(): Promise<GymResponseDto[]> {
    const gyms = await this.prisma.gym.findMany({
      where: { deleted_at: null },
      include: {
        coach_owner: {
          include: {
            person: {
              select: {
                name: true,
                surname: true,
              },
            },
          },
        },
        coaches: {
          where: { deleted_at: null },
          select: { id: true },
        },
        athletes: {
          where: { deleted_at: null },
          select: { id: true },
        },
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
        person: {
          select: {
            dni: true,
            name: true,
            surname: true,
            birthday: true,
            gender: true,
            status: true,
          },
        },
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

  // ==================== COMPETITIONS ====================

  async createCompetition(
    dto: CreateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.competitionService.create(dto);
  }

  async findAllCompetitions(
    dto: FindCompetitionDto,
  ): Promise<CompetitionDto[]> {
    return this.competitionService.findAll(dto);
  }

  async findOneCompetition(id: string): Promise<CompetitionDto> {
    return this.competitionService.findOne(id);
  }

  async updateCompetition(
    id: string,
    dto: UpdateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.competitionService.update(id, dto);
  }

  async removeCompetition(id: string): Promise<void> {
    return this.competitionService.remove(id);
  }

  // ==================== COMPETITION DIVISIONS ====================

  async createCompetitionDivision(dto: CreateCompetitionDivisionDto) {
    return this.competitionDivisionService.create(dto);
  }

  async findAllCompetitionDivisions() {
    return this.competitionDivisionService.findAll();
  }

  async findOneCompetitionDivision(id: string) {
    return this.competitionDivisionService.findOne(id);
  }

  async updateCompetitionDivision(
    id: string,
    dto: UpdateCompetitionDivisionDto,
  ) {
    return this.competitionDivisionService.update(id, dto);
  }

  async removeCompetitionDivision(id: string): Promise<void> {
    return this.competitionDivisionService.remove(id);
  }
}
