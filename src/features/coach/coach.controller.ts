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
import { CreateCoachDto, CoachResponseDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { AthleteResponseDto } from '../athlete/dto/create-athlete.dto';
import { RegisterAthleteUseCase } from './use-cases/register-athlete.use-case';
import { AssignAthleteToGymUseCase } from './use-cases/assign-athlete-gym.use-case';

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
    type: CoachResponseDto,
  })
  @Post()
  async create(
    @Body() createCoachDto: CreateCoachDto,
  ): Promise<CoachResponseDto> {
    return this.coachService.create(createCoachDto);
  }

  @Post(':idGym/athlete')
  @ApiOperation({ summary: 'Registrar nuevo atleta en un gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Atleta registrado en el gym',
    type: AthleteResponseDto,
  })
  async registerAthleteInGym(
    @Param('idGym') idGym: string,
    @Body() createPerson: CreatePersonDto,
  ): Promise<AthleteResponseDto> {
    return this.registerAthleteUseCase.execute(createPerson, idGym);
  }

  @Patch(':idGym/athlete/:idAthlete')
  @ApiOperation({ summary: 'Asignar un atleta existente a un gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Atleta registrado en el gym',
    type: AthleteResponseDto,
  })
  async assignAthleteInGym(
    @Param('idGym') idGym: string,
    @Param('idAthlete') idAthlete: string,
  ): Promise<AthleteResponseDto> {
    return this.assignAthleteToGymUseCase.execute(idAthlete, idGym);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los atletas' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de atletas registrados',
    type: [CoachResponseDto],
  })
  async findAll(): Promise<CoachResponseDto[]> {
    return this.coachService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atleta por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un atleta por su identificador',
    type: CoachResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CoachResponseDto> {
    return this.coachService.findOne(id);
  }

  @Get('gym/:gymId/coaches')
  @ApiOperation({ summary: 'Obtener todos los coaches de un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Coaches del gimnasio ... obtenidos.',
  })
  async findCoachesByGym(@Param('gymId') gymId: string): Promise<any> {
    return this.coachService.findAllCoachesByGym(gymId);
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener el perfil de un coach' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del coach... obtenido.',
  })
  async findCoachProfile(@Param('id') id: string): Promise<any> {
    return this.coachService.findCoachProfile(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar coach' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del coach',
    type: CoachResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ): Promise<CoachResponseDto> {
    return this.coachService.update(id, updateCoachDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar coach' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un coach de la base de datos',
    type: CoachResponseDto,
  })
  async remove(@Param('id') id: string) {
    await this.coachService.remove(id);
  }
}
