import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { CreateAthleteDto, AthleteResponseDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Athlete')
@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo atleta' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo atleta exitosamente',
    type: AthleteResponseDto,
  })
  async create(
    @Body() createAthleteDto: CreateAthleteDto,
  ): Promise<AthleteResponseDto> {
    return this.athleteService.create(createAthleteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los atletas' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de atletas registrados',
    type: [AthleteResponseDto],
  })
  async findAll(): Promise<AthleteResponseDto[]> {
    return this.athleteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atleta por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un atleta por su identificador',
    type: AthleteResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AthleteResponseDto> {
    return this.athleteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar atleta' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del atleta',
    type: AthleteResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAthleteDto: UpdateAthleteDto,
  ): Promise<AthleteResponseDto> {
    return this.athleteService.update(id, updateAthleteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar atleta' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un atleta de la base de datos',
    type: AthleteResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.athleteService.remove(id);
  }
}
