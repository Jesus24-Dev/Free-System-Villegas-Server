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
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateAthleteDto, UpdateAthleteDto } from './dto/request';
import { AthleteDto, RawAthleteDto } from './dto/response';
import { AthleteProfileResponseDto } from './dto/response/athlete-profile-response.dto';

@ApiTags('Athlete')
@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo atleta' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo atleta exitosamente',
    type: RawAthleteDto,
  })
  async create(
    @Body() createAthleteDto: CreateAthleteDto,
  ): Promise<RawAthleteDto> {
    return this.athleteService.create(createAthleteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los atletas' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de atletas registrados',
    type: [AthleteDto],
  })
  async findAll(): Promise<AthleteDto[]> {
    const athletes = await this.athleteService.findAll();
    return athletes.map((athlete) => ({
      id: athlete.id,
      dni: athlete.person.dni,
      name: athlete.person.name,
      surname: athlete.person.surname,
      gender: athlete.person.gender,
      birthday: athlete.person.birthday,
      status: athlete.person.status,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atleta por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un atleta por su identificador',
    type: AthleteDto,
  })
  async findOne(@Param('id') id: string): Promise<AthleteDto> {
    const athlete = await this.athleteService.findOne(id);
    return {
      id: athlete.id,
      dni: athlete.person.dni,
      name: athlete.person.name,
      surname: athlete.person.surname,
      gender: athlete.person.gender,
      birthday: athlete.person.birthday,
      status: athlete.person.status,
    };
  }

  @Get('gym/:gymId/athletes')
  @ApiOperation({ summary: 'Obtener todos los atletas de un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Atletas del gimnasio ... obtenidos.',
    type: [AthleteDto],
  })
  async findAthletesByGym(
    @Param('gymId') gymId: string,
  ): Promise<AthleteDto[]> {
    const athletes = await this.athleteService.findAllAthletesByGym(gymId);
    return athletes;
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener el perfil de un atleta' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del atleta... obtenido.',
    type: AthleteProfileResponseDto,
  })
  async findAthleteProfile(
    @Param('id') id: string,
  ): Promise<AthleteProfileResponseDto> {
    return this.athleteService.findAthleteProfile(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar atleta' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del atleta',
    type: AthleteDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAthleteDto: UpdateAthleteDto,
  ): Promise<RawAthleteDto> {
    return this.athleteService.update(id, updateAthleteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar atleta' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un atleta de la base de datos',
    type: AthleteDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.athleteService.remove(id);
  }
}
