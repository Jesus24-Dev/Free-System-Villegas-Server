import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WeightsFilterDto } from './dto/weights-filter.dto';
import { Fighting_Weights } from 'src/generated/prisma/client';

@Injectable()
export class WeightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: WeightsFilterDto): Promise<Fighting_Weights[]> {
    const { mode, gender, category } = filters;
    return this.prisma.fighting_Weights.findMany({
      where: {
        mode,
        gender,
        category,
      },
    });
  }
}
