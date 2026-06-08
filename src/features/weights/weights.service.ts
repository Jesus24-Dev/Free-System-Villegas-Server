import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WeightsFilterDto } from './dto/weights-filter.dto';

@Injectable()
export class WeightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: WeightsFilterDto) {
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
