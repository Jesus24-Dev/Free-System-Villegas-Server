import { Injectable } from '@nestjs/common';
import { CreateAthleteRegisterDto } from './dto/create-athlete-register.dto';
import { UpdateAthleteRegisterDto } from './dto/update-athlete-register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AthleteRegisterService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAthleteRegisterDto: CreateAthleteRegisterDto) {
    return this.prisma.athlete_Registration.create({
      data: createAthleteRegisterDto,
    });
  }

  async findAll() {
    return this.prisma.athlete_Registration.findMany();
  }

  async findOne(id: string) {
    return this.prisma.athlete_Registration.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAthleteRegisterDto: UpdateAthleteRegisterDto) {
    return this.prisma.athlete_Registration.update({
      where: { id },
      data: updateAthleteRegisterDto,
    });
  }

  async remove(id: string) {
    return this.prisma.athlete_Registration.delete({
      where: { id },
    });
  }
}
