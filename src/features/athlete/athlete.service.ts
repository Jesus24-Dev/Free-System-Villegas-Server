import { Injectable } from '@nestjs/common';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AthleteService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAthleteDto: CreateAthleteDto) {
    return this.prisma.athlete.create({
      data: createAthleteDto,
    });
  }

  async findAll() {
    return this.prisma.athlete.findMany({});
  }

  async findOne(id: string) {
    return this.prisma.athlete.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAthleteDto: UpdateAthleteDto) {
    return this.prisma.athlete.update({
      where: { id },
      data: updateAthleteDto,
    });
  }

  async remove(id: string) {
    return this.prisma.athlete.delete({
      where: { id },
    });
  }
}
