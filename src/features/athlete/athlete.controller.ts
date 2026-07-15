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
import {
  CreateAthleteDto,
  UpdateAthleteDto,
  UpdatePersonByCoachDto,
} from './dto/request';
import { AthleteDto, RawAthleteDto } from './dto/response';
import { AthleteHasAccountResponseDto } from './dto/response/athlete-has-account-response.dto';
import { AthleteProfileResponseDto } from './dto/response/athlete-profile-response.dto';
import { AthleteAsCoachResponseDto } from './dto/response/athlete-as-coach-response.dto';
import { PromoteAthleteToCoachUseCase } from './use-cases/promote-athlete-to-coach.use-case';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/dto/request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Athlete')
@Controller('athlete')
export class AthleteController {
  constructor(
    private readonly athleteService: AthleteService,
    private readonly promoteAthleteToCoachUseCase: PromoteAthleteToCoachUseCase,
  ) {}

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
        gym_id: athlete.gym_id,
        dni: athlete.person.dni,
        name: athlete.person.name,
        surname: athlete.person.surname,
        gender: athlete.person.gender,
        birthday: athlete.person.birthday,
        status: athlete.person.status,
        created_at: athlete.created_at,
        updated_at: athlete.updated_at,
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
      gym_id: athlete.gym_id,
      dni: athlete.person.dni,
      name: athlete.person.name,
      surname: athlete.person.surname,
      gender: athlete.person.gender,
      birthday: athlete.person.birthday,
      status: athlete.person.status,
      created_at: athlete.created_at,
      updated_at: athlete.updated_at,
    };
  }

  @Roles('ADMIN', 'COACH')
  @Get('gym/:gymId/athletes')
  @ApiOperation({
    summary: 'Obtener atletas del gimnasio que NO son coaches',
    description:
      'Retorna atletas del gimnasio que no tienen rol COACH. Use excludeCoaches=false para incluir tambien coaches.',
  })
  @ApiResponse({
    status: 200,
    description: 'Atletas del gimnasio obtenidos.',
    type: [AthleteDto],
  })
  async findAthletesByGym(
    @Param('gymId') gymId: string,
    @Query('excludeCoaches') excludeCoaches?: string,
  ): Promise<AthleteDto[]> {
    const shouldExclude = excludeCoaches !== 'false';
    const athletes = await this.athleteService.findAllAthletesByGym(
      gymId,
      shouldExclude,
    );
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

  @Roles('ADMIN', 'COACH')
  @Get(':id/has-account')
  @ApiOperation({
    summary: 'Verificar si un atleta tiene cuenta de usuario',
    description:
      'Retorna true si el atleta tiene una cuenta de usuario (User) asociada, false si no.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la verificacion',
    type: AthleteHasAccountResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Atleta no encontrado' })
  async hasAccount(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AthleteHasAccountResponseDto> {
    const hasAccount = await this.athleteService.hasAccount(id);
    return { hasAccount };
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id/promote-to-coach')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Promover atleta a entrenador',
    description:
      'Permite al dueno del gimnasio o un administrador promover un atleta a entrenador. El atleta debe tener una cuenta de usuario asociada. Se agrega el rol COACH al usuario y se crea un registro en la tabla Coach con el mismo gimnasio del atleta.',
  })
  @ApiResponse({
    status: 200,
    description: 'Atleta promovido a entrenador exitosamente',
    type: AthleteAsCoachResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atleta no encontrado o no tiene cuenta de usuario',
  })
  @ApiResponse({
    status: 409,
    description:
      'El atleta ya tiene el rol COACH o ya existe un registro de coach',
  })
  @ApiResponse({
    status: 403,
    description: 'No eres el dueno del gimnasio donde esta asignado el atleta',
  })
  async promoteToCoach(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ): Promise<AthleteAsCoachResponseDto> {
    const updatedUser = await this.promoteAthleteToCoachUseCase.execute(
      id,
      user.sub,
      user.role || [],
    );
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      message: 'Atleta promovido a entrenador exitosamente',
    };
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

  @Roles('ADMIN', 'COACH')
  @Patch(':id/person')
  @ApiOperation({
    summary: 'Actualizar datos personales de un atleta (solo coach)',
    description:
      'Permite a un coach editar los datos personales de un atleta que NO tiene cuenta de usuario. Si el atleta tiene cuenta, lanzara un error.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos personales actualizados exitosamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Atleta no encontrado o el atleta tiene cuenta de usuario (no editable por coach)',
  })
  async updatePersonByCoach(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonByCoachDto,
  ) {
    return this.athleteService.updatePersonByCoach(id, dto);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id/unassign-gym')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover atleta de un gimnasio',
    description:
      'Desasigna al atleta del gimnasio al que pertenece. El atleta debe estar asignado a un gimnasio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Atleta removido del gimnasio exitosamente',
    type: RawAthleteDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atleta no encontrado o no asignado a ningún gimnasio',
  })
  async removeFromGym(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RawAthleteDto> {
    const athlete = await this.athleteService.removeFromGym(id);
    return {
      id: athlete.id,
      person_id: athlete.person_id,
      gym_id: athlete.gym_id,
      created_at: athlete.created_at,
      updated_at: athlete.updated_at,
    };
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
