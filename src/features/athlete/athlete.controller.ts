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
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateAthleteDto, UpdateAthleteDto } from './dto/request';
import { AthleteDto, RawAthleteDto } from './dto/response';
import { AthleteProfileResponseDto } from './dto/response/athlete-profile-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Athlete')
@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Roles('ADMIN')
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

  @Roles('ADMIN', 'COACH')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los atletas' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de atletas registrados',
    type: [AthleteDto],
  })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<AthleteDto>> {
    const result = await this.athleteService.findAll(pagination);
    return new PaginatedResponseDto(
      result.data.map((athlete) => ({
        id: athlete.id,
        person_id: athlete.person_id,
        dni: athlete.person.dni,
        name: athlete.person.name,
        surname: athlete.person.surname,
        gender: athlete.person.gender,
        birthday: athlete.person.birthday,
        status: athlete.person.status,
      })),
      result.total,
      result.page,
      result.limit,
    );
  }

  @Roles('ADMIN', 'COACH')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atleta por su ID de persona' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un atleta por su identificador de persona',
    type: AthleteDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AthleteDto> {
    const athlete = await this.athleteService.findOne(id);
    return {
      id: athlete.id,
      person_id: athlete.person_id,
      dni: athlete.person.dni,
      name: athlete.person.name,
      surname: athlete.person.surname,
      gender: athlete.person.gender,
      birthday: athlete.person.birthday,
      status: athlete.person.status,
    };
  }

  @Roles('ADMIN', 'COACH')
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

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get('profile/:id')
  @ApiOperation({
    summary: 'Obtener el perfil de un atleta',
    description:
      'Acepta el ID de usuario (para atletas logueados) o el ID de atleta (desde admin/coach/gimnasio)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del atleta... obtenido.',
    type: AthleteProfileResponseDto,
  })
  async findAthleteProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AthleteProfileResponseDto> {
    return this.athleteService.findAthleteProfile(id);
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar atleta por ID de persona' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del atleta',
    type: AthleteDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAthleteDto: UpdateAthleteDto,
  ): Promise<RawAthleteDto> {
    return this.athleteService.update(id, updateAthleteDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar atleta por ID de persona' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un atleta de la base de datos',
    type: AthleteDto,
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.athleteService.remove(id);
  }
}
