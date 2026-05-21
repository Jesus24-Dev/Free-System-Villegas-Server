import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParseEnumCaseInsensitivePipe } from 'src/common/pipes/parse-enum-case-insensitive.pipe';
import { WeightsService } from './weights.service';
import {
  Fighting_Mode,
  Gender,
  Fighting_Category,
} from 'src/generated/prisma/enums';

@Controller('weights')
export class WeightsController {
  constructor(private readonly weightsService: WeightsService) {}

  @Get()
  async findAll(
    @Query('mode', new ParseEnumCaseInsensitivePipe(Fighting_Mode, 'mode'))
    mode?: Fighting_Mode,
    @Query('gender', new ParseEnumCaseInsensitivePipe(Gender, 'gender'))
    gender?: Gender,
    @Query(
      'category',
      new ParseEnumCaseInsensitivePipe(Fighting_Category, 'category'),
    )
    category?: Fighting_Category,
  ) {
    if (mode && category && gender) {
      return this.weightsService.findByModeCategoryAndGender(
        mode,
        category,
        gender,
      );
    } else if (mode && category) {
      return this.weightsService.findByModeAndCategory(mode, category);
    } else if (gender && category) {
      return this.weightsService.findByGenderAndCategory(gender, category);
    } else if (mode && gender) {
      return this.weightsService.findByModeAndGender(mode, gender);
    } else {
      return this.weightsService.findAll();
    }
  }

  @Get('gender/:gender')
  async findByGender(
    @Param('gender', new ParseEnumCaseInsensitivePipe(Gender, 'gender'))
    gender: Gender,
  ) {
    return this.weightsService.findByGender(gender);
  }

  @Get('category/:category')
  async findByCategory(
    @Param(
      'category',
      new ParseEnumCaseInsensitivePipe(Fighting_Category, 'category'),
    )
    category: Fighting_Category,
  ) {
    return this.weightsService.findByCategory(category);
  }

  @Get('mode/:mode')
  async findByMode(
    @Param('mode', new ParseEnumCaseInsensitivePipe(Fighting_Mode, 'mode'))
    mode: Fighting_Mode,
  ) {
    return this.weightsService.findByMode(mode);
  }
}
