import { Injectable } from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GymService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGymDto: CreateGymDto) {
    return this.prisma.gym.create({ data: createGymDto });
  }

  async findAll() {
    return this.prisma.gym.findMany();
  }

  async findOne(id: string) {
    return this.prisma.gym.findUnique({ where: { id } });
  }

  async update(id: string, updateGymDto: UpdateGymDto) {
    return this.prisma.gym.update({
      where: { id },
      data: updateGymDto,
    });
  }

  async remove(id: string) {
    return this.prisma.gym.delete({ where: { id } });
  }
}
