import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AthleteRegisterService } from './athlete-register.service';
import { CreateAthleteRegisterDto } from './dto/create-athlete-register.dto';
import { UpdateAthleteRegisterDto } from './dto/update-athlete-register.dto';

@Controller('athlete-register')
export class AthleteRegisterController {
  constructor(
    private readonly athleteRegisterService: AthleteRegisterService,
  ) {}

  @Post()
  create(@Body() createAthleteRegisterDto: CreateAthleteRegisterDto) {
    return this.athleteRegisterService.create(createAthleteRegisterDto);
  }

  @Get()
  findAll() {
    return this.athleteRegisterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athleteRegisterService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAthleteRegisterDto: UpdateAthleteRegisterDto,
  ) {
    return this.athleteRegisterService.update(id, updateAthleteRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athleteRegisterService.remove(id);
  }
}
