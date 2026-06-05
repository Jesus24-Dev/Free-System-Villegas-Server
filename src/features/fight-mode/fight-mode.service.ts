import { Injectable } from '@nestjs/common';
import { CreateFightModeDto } from './dto/create-fight-mode.dto';
import { UpdateFightModeDto } from './dto/update-fight-mode.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FightModeService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFightModeDto: CreateFightModeDto) {
    return this.prisma.fight_Mode.create({
      data: createFightModeDto,
    });
  }

  async findAll() {
    return this.prisma.fight_Mode.findMany();
  }

  async findOne(id: string) {
    return this.prisma.fight_Mode.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateFightModeDto: UpdateFightModeDto) {
    return this.prisma.fight_Mode.update({
      where: { id },
      data: updateFightModeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.fight_Mode.delete({
      where: { id },
    });
  }
}
