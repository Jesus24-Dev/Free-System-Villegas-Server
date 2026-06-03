import { Injectable } from '@nestjs/common';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoachService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCoachDto: CreateCoachDto) {
    return this.prisma.coach.create({
      data: createCoachDto,
    });
  }

  async findAll() {
    return this.prisma.coach.findMany({
      include: { person: true, gym: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.coach.findUnique({
      where: { id },
      include: { person: true, gym: true },
    });
  }

  async update(id: string, updateCoachDto: UpdateCoachDto) {
    return this.prisma.coach.update({
      where: { id },
      data: updateCoachDto,
    });
  }

  async remove(id: string) {
    return this.prisma.coach.delete({
      where: { id },
    });
  }
}
