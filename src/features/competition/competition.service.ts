import { Injectable } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCompetitionDto: CreateCompetitionDto) {
    return this.prisma.competition.create({
      data: createCompetitionDto,
    });
  }

  async findAll() {
    return this.prisma.competition.findMany();
  }

  async findOne(id: string) {
    return this.prisma.competition.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCompetitionDto: UpdateCompetitionDto) {
    return this.prisma.competition.update({
      where: { id },
      data: updateCompetitionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.competition.delete({
      where: { id },
    });
  }
}
