import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  create(@Body() createAthleteDto: CreateAthleteDto) {
    return this.athleteService.create(createAthleteDto);
  }

  @Get()
  findAll() {
    return this.athleteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athleteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAthleteDto: UpdateAthleteDto) {
    return this.athleteService.update(id, updateAthleteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athleteService.remove(id);
  }
}
