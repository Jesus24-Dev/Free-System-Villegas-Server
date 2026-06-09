import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFightModeDto } from './dto/create-fight-mode.dto';
import { UpdateFightModeDto } from './dto/update-fight-mode.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Fight_Mode } from 'src/generated/prisma/client';

@Injectable()
export class FightModeService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFightModeDto: CreateFightModeDto): Promise<Fight_Mode> {
    return this.prisma.fight_Mode.create({
      data: createFightModeDto,
    });
  }

  async findAll(): Promise<Fight_Mode[]> {
    return this.prisma.fight_Mode.findMany();
  }

  async findOne(id: string): Promise<Fight_Mode> {
    const fightMode = await this.prisma.fight_Mode.findUnique({
      where: { id },
    });

    if (!fightMode) {
      throw new NotFoundException(
        `Modo de pelea con id ${id} no fue encontrado`,
      );
    }

    return fightMode;
  }

  async update(
    id: string,
    updateFightModeDto: UpdateFightModeDto,
  ): Promise<Fight_Mode> {
    return this.prisma.fight_Mode.update({
      where: { id },
      data: updateFightModeDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.fight_Mode.delete({
      where: { id },
    });
  }
}
