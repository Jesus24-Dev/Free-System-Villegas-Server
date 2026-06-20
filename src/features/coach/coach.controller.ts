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
import { CoachService } from './coach.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreatePersonDto } from '../person/dto/request/create-person.dto';
import { CreateAthleteDto } from '../athlete/dto/request/create-athlete.dto';
import { RegisterAthleteUseCase } from './use-cases/register-athlete.use-case';
import { AssignAthleteToGymUseCase } from './use-cases/assign-athlete-gym.use-case';
import { CoachDto, RawCoachDto } from './dto/response';
import { CreateCoachDto, UpdateCoachDto } from './dto/request';

@ApiTags('Coach')
@Controller('coach')
export class CoachController {
  constructor(
    private readonly coachService: CoachService,
    private readonly registerAthleteUseCase: RegisterAthleteUseCase,
    private readonly assignAthleteToGymUseCase: AssignAthleteToGymUseCase,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo coach' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo coach exitosamente',
    type: RawCoachDto,
  })
  @Post()
  async create(@Body() createCoachDto: CreateCoachDto): Promise<RawCoachDto> {
    return this.coachService.create(createCoachDto);
  }

  @Post(':idGym/athlete')
  @ApiOperation({ summary: 'Registrar nuevo atleta en un gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Atleta registrado en el gym',
    type: CreateAthleteDto,
  })
  async registerAthleteInGym(
    @Param('idGym') idGym: string,
    @Body() createPerson: CreatePersonDto,
  ): Promise<CreateAthleteDto> {
    return this.registerAthleteUseCase.execute(createPerson, idGym);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los coaches' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de coaches registrados',
    type: [CoachDto],
  })
  async findAll(): Promise<CoachDto[]> {
    const coaches = await this.coachService.findAll();
    return coaches.map((coach) => ({
      id: coach.id,
      dni: coach.person.dni,
      name: coach.person.name,
      surname: coach.person.surname,
      gender: coach.person.gender,
      birthday: coach.person.birthday,
      status: coach.person.status,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un coach por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un coach por su identificador',
    type: CoachDto,
  })
  async findOne(@Param('id') id: string): Promise<CoachDto> {
    const coach = await this.coachService.findOne(id);
    return {
      id: coach.id,
      dni: coach.person.dni,
      name: coach.person.name,
      surname: coach.person.surname,
      gender: coach.person.gender,
      birthday: coach.person.birthday,
      status: coach.person.status,
    };
  }

  @Get('gym/:gymId/coaches')
  @ApiOperation({ summary: 'Obtener todos los coaches de un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Coaches del gimnasio ... obtenidos.',
    type: CoachDto,
  })
  async findCoachesByGym(@Param('gymId') gymId: string): Promise<CoachDto[]> {
    return this.coachService.findAllCoachesByGym(gymId);
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener el perfil de un coach' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del coach... obtenido.',
    type: CoachDto,
  })
  async findCoachProfile(@Param('id') id: string): Promise<CoachDto> {
    return this.coachService.findCoachProfile(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar coach' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del coach',
    type: RawCoachDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ): Promise<RawCoachDto> {
    return this.coachService.update(id, updateCoachDto);
  }

  @Patch(':idGym/athlete/:idAthlete')
  @ApiOperation({ summary: 'Asignar un atleta existente a un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Atleta registrado en el gym',
    type: CreateAthleteDto,
  })
  async assignAthleteInGym(
    @Param('idGym') idGym: string,
    @Param('idAthlete') idAthlete: string,
  ): Promise<CreateAthleteDto> {
    return this.assignAthleteToGymUseCase.execute(idAthlete, idGym);
  }

  @Patch(':idGym/athlete/:idAthlete')
  @ApiOperation({ summary: 'Asignar un coach existente a un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Coach asignado en el gym',
    type: RawCoachDto,
  })
  async assignCoachInGym(
    @Param('idGym') idGym: string,
    @Param('idAthlete') idCoach: string,
  ): Promise<RawCoachDto> {
    return this.assignAthleteToGymUseCase.execute(idCoach, idGym);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar coach' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un coach de la base de datos',
  })
  async remove(@Param('id') id: string) {
    await this.coachService.remove(id);
  }
}
