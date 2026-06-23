import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WeightsFilterDto } from './dto/weights-filter.dto';
import { FightingWeights } from '@prisma/client';

@Injectable()
export class WeightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: WeightsFilterDto): Promise<FightingWeights[]> {
    const { mode, gender, category } = filters;
    return this.prisma.fightingWeights.findMany({
      where: {
        mode,
        gender,
        category,
      },
    });
  }
}
