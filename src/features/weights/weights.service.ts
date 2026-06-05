import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Gender,
  Fighting_Category,
  Fighting_Mode,
} from 'src/generated/prisma/enums';

@Injectable()
export class WeightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.fighting_Weights.findMany();
  }

  async findByGender(gender: Gender) {
    return this.prisma.fighting_Weights.findMany({ where: { gender } });
  }

  async findByCategory(category: Fighting_Category) {
    return this.prisma.fighting_Weights.findMany({ where: { category } });
  }

  async findByMode(mode: Fighting_Mode) {
    return this.prisma.fighting_Weights.findMany({ where: { mode } });
  }

  async findByModeAndGender(mode: Fighting_Mode, gender: Gender) {
    return this.prisma.fighting_Weights.findMany({
      where: { mode, gender },
    });
  }

  async findByGenderAndCategory(gender: Gender, category: Fighting_Category) {
    return this.prisma.fighting_Weights.findMany({
      where: { category, gender },
    });
  }

  async findByModeAndCategory(
    mode: Fighting_Mode,
    category: Fighting_Category,
  ) {
    return this.prisma.fighting_Weights.findMany({
      where: { mode, category },
    });
  }

  async findByModeCategoryAndGender(
    mode: Fighting_Mode,
    category: Fighting_Category,
    gender: Gender,
  ) {
    return this.prisma.fighting_Weights.findMany({
      where: { mode, category, gender },
    });
  }
}
