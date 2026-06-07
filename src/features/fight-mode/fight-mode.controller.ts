import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FightModeService } from './fight-mode.service';
import { CreateFightModeDto } from './dto/create-fight-mode.dto';
import { UpdateFightModeDto } from './dto/update-fight-mode.dto';

@Controller('fight-mode')
export class FightModeController {
  constructor(private readonly fightModeService: FightModeService) {}

  @Post()
  create(@Body() createFightModeDto: CreateFightModeDto) {
    return this.fightModeService.create(createFightModeDto);
  }

  @Get()
  findAll() {
    return this.fightModeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fightModeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFightModeDto: UpdateFightModeDto,
  ) {
    return this.fightModeService.update(id, updateFightModeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fightModeService.remove(id);
  }
}
