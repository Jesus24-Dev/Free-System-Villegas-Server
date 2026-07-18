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
import { CoachService } from './coach.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreatePersonDto } from '../person/dto/request/create-person.dto';
import { CreateAthleteDto } from '../athlete/dto/request/create-athlete.dto';
import { RegisterAthleteUseCase } from './use-cases/register-athlete.use-case';
import { AssignAthleteToGymUseCase } from './use-cases/assign-athlete-gym.use-case';
import { AssignCoachToGymUseCase } from './use-cases/assign-coach-gym.use-case';
import { RegisterAsAthleteUseCase } from './use-cases/register-as-athlete.use-case';
import {
  CoachDto,
  CoachMeResponseDto,
  RawCoachDto,
  CoachAsAthleteResponseDto,
} from './dto/response';
import { CreateCoachDto, UpdateCoachDto } from './dto/request';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/dto/request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Coach')
@Controller('coach')
export class CoachController {
  constructor(
    private readonly coachService: CoachService,
    private readonly registerAthleteUseCase: RegisterAthleteUseCase,
    private readonly assignAthleteToGymUseCase: AssignAthleteToGymUseCase,
    private readonly assignCoachToGymUseCase: AssignCoachToGymUseCase,
    private readonly registerAsAthleteUseCase: RegisterAsAthleteUseCase,
  ) {}

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los coaches' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de coaches registrados',
    type: [CoachDto],
  })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CoachDto>> {
    const result = await this.coachService.findAll(pagination);
    return new PaginatedResponseDto(
      result.data.map((coach) => ({
        id: coach.id,
        person_id: coach.person_id,
        gym_id: coach.gym_id,
        dni: coach.person.dni,
        name: coach.person.name,
        surname: coach.person.surname,
        gender: coach.person.gender,
        birthday: coach.person.birthday,
        status: coach.person.status,
        created_at: coach.created_at,
        updated_at: coach.updated_at,
      })),
      result.total,
      result.page,
      result.limit,
    );
  }

  @Roles('COACH')
  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del coach autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del coach autenticado obtenido exitosamente',
    type: CoachMeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Perfil de coach no encontrado' })
  async findMyProfile(
    @GetUser() user: JwtPayload,
  ): Promise<CoachMeResponseDto> {
    return this.coachService.findCoachByUserId(user.sub);
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un coach por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un coach por su identificador',
    type: CoachDto,
  })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CoachDto> {
    const coach = await this.coachService.findOne(id);
    return {
      id: coach.id,
      person_id: coach.person_id,
      gym_id: coach.gym_id,
      dni: coach.person.dni,
      name: coach.person.name,
      surname: coach.person.surname,
      gender: coach.person.gender,
      birthday: coach.person.birthday,
      status: coach.person.status,
      created_at: coach.created_at,
      updated_at: coach.updated_at,
    };
  }

  @Roles('ADMIN', 'COACH')
  @Get('gym/:gymId/coaches')
  @ApiOperation({ summary: 'Obtener todos los coaches de un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Coaches del gimnasio obtenidos.',
    type: [CoachDto],
  })
  @ApiResponse({ status: 404, description: 'Gimnasio no encontrado' })
  async findCoachesByGym(
    @Param('gymId', ParseUUIDPipe) gymId: string,
  ): Promise<CoachDto[]> {
    return this.coachService.findAllCoachesByGym(gymId);
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener el perfil de un coach' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del coach obtenido.',
    type: CoachDto,
  })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  async findCoachProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CoachDto> {
    return this.coachService.findCoachProfile(id);
  }

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo coach' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo coach exitosamente',
    type: RawCoachDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un coach con esa cedula' })
  async create(@Body() createCoachDto: CreateCoachDto): Promise<RawCoachDto> {
    return this.coachService.create(createCoachDto);
  }

  @Roles('ADMIN', 'COACH')
  @Post(':idGym/athlete')
  @ApiOperation({ summary: 'Registrar nuevo atleta en un gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Atleta registrado en el gym',
    type: CreateAthleteDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Gimnasio no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un atleta con esa cedula en el gimnasio',
  })
  async registerAthleteInGym(
    @Param('idGym', ParseUUIDPipe) idGym: string,
    @Body() createPerson: CreatePersonDto,
  ): Promise<CreateAthleteDto> {
    return this.registerAthleteUseCase.execute(createPerson, idGym);
  }

  @Roles('COACH')
  @Post('register-as-athlete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrarse como atleta',
    description:
      'Permite a un coach registrarse como atleta para participar en competencias. Se agrega el rol ATHLETE al usuario y se crea un registro en la tabla Athlete.',
  })
  @ApiResponse({
    status: 201,
    description: 'Coach registrado como atleta exitosamente',
    type: CoachAsAthleteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Coach no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'El coach ya tiene el rol ATHLETE o ya existe un registro de atleta',
  })
  async registerAsAthlete(
    @GetUser() user: JwtPayload,
  ): Promise<CoachAsAthleteResponseDto> {
    const updatedUser = await this.registerAsAthleteUseCase.execute(user.sub);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      message: 'Coach registrado como atleta exitosamente',
    };
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar coach' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del coach',
    type: RawCoachDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ): Promise<RawCoachDto> {
    return this.coachService.update(id, updateCoachDto);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':idGym/athlete/:idAthlete')
  @ApiOperation({ summary: 'Asignar un atleta existente a un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Atleta asignado al gimnasio exitosamente',
    type: CreateAthleteDto,
  })
  @ApiResponse({ status: 404, description: 'Atleta o gimnasio no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El atleta ya está asignado a un gimnasio',
  })
  async assignAthleteInGym(
    @Param('idGym', ParseUUIDPipe) idGym: string,
    @Param('idAthlete', ParseUUIDPipe) idAthlete: string,
  ): Promise<CreateAthleteDto> {
    return this.assignAthleteToGymUseCase.execute(idAthlete, idGym);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':idGym/coach/:idCoach')
  @ApiOperation({ summary: 'Asignar un coach existente a un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Coach asignado al gimnasio exitosamente',
    type: RawCoachDto,
  })
  @ApiResponse({ status: 404, description: 'Coach o gimnasio no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El coach ya está asignado a un gimnasio',
  })
  async assignCoachInGym(
    @Param('idGym', ParseUUIDPipe) idGym: string,
    @Param('idCoach', ParseUUIDPipe) idCoach: string,
  ): Promise<RawCoachDto> {
    return this.assignCoachToGymUseCase.execute(idCoach, idGym);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id/unassign-gym')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover coach de un gimnasio',
    description:
      'Desasigna al coach del gimnasio al que pertenece. El coach debe estar asignado a un gimnasio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Coach removido del gimnasio exitosamente',
    type: RawCoachDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Coach no encontrado o no asignado a ningún gimnasio',
  })
  async removeFromGym(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RawCoachDto> {
    const coach = await this.coachService.removeFromGym(id);
    return {
      id: coach.id,
      person_id: coach.person_id,
      gym_id: coach.gym_id,
      created_at: coach.created_at,
      updated_at: coach.updated_at,
    };
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar coach' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un coach de la base de datos',
  })
  @ApiResponse({ status: 404, description: 'Coach no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.coachService.remove(id);
  }
}
