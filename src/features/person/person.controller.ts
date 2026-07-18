import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { PersonDto, PersonFoundedResponseDto, CoachGymByDniResponseDto, AthleteGymByDniResponseDto } from './dto/response';
import { CreatePersonDto, UpdatePersonDto } from './dto/request';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las personas',
    type: [PersonDto],
  })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<PersonDto>> {
    const result = await this.personService.findAll(pagination);
    return new PaginatedResponseDto(
      result.data.map((person) => ({
        id: person.id,
        dni: person.dni,
        name: person.name,
        surname: person.surname,
        birthday: person.birthday,
        gender: person.gender,
        status: person.status,
      })),
      result.total,
      result.page,
      result.limit,
    );
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona encontrada',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PersonDto> {
    const person = await this.personService.findOne(id);
    return {
      id: person.id,
      dni: person.dni,
      name: person.name,
      surname: person.surname,
      birthday: person.birthday,
      gender: person.gender,
      status: person.status,
    };
  }

  @Public()
  @Get('dni/:dni')
  @ApiOperation({ summary: 'Comprueba si una persona existe para el registro' })
  @ApiResponse({
    status: 200,
    description: 'Persona o no encontrada',
    type: PersonFoundedResponseDto,
  })
  async checkIfPersonByDnyExists(
    @Param('dni') dni: string,
  ): Promise<PersonFoundedResponseDto | null> {
    return this.personService.checkIfPersonByDnyExists(dni);
  }

  @Roles('ADMIN', 'COACH')
  @Get('dni/:dni/coach-gym')
  @ApiOperation({
    summary: 'Verificar si un coach tiene gimnasio por cedula',
    description:
      'Retorna si el coach tiene un gimnasio asignado o es dueno de uno, junto con los datos del gimnasio si existe.',
  })
  @ApiResponse({
    status: 200,
    description: 'Informacion del gym del coach',
    type: CoachGymByDniResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Persona o coach no encontrado' })
  async findCoachGymByDni(
    @Param('dni') dni: string,
  ): Promise<CoachGymByDniResponseDto> {
    return this.personService.findCoachGymByDni(dni);
  }

  @Roles('ADMIN', 'COACH')
  @Get('dni/:dni/athlete-gym')
  @ApiOperation({
    summary: 'Verificar si un atleta tiene gimnasio por cedula',
    description:
      'Retorna si el atleta tiene un gimnasio asignado, junto con los datos del gimnasio si existe.',
  })
  @ApiResponse({
    status: 200,
    description: 'Informacion del gym del atleta',
    type: AthleteGymByDniResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Persona o atleta no encontrado' })
  async findAthleteGymByDni(
    @Param('dni') dni: string,
  ): Promise<AthleteGymByDniResponseDto> {
    return this.personService.findAthleteGymByDni(dni);
  }

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva persona' })
  @ApiResponse({
    status: 201,
    description: 'La persona ha sido creada exitosamente',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 409, description: 'La cedula ya esta registrada' })
  async create(
    @Body(new ValidationPipe()) createPersonDto: CreatePersonDto,
  ): Promise<PersonDto> {
    const person = await this.personService.create(createPersonDto);
    return {
      id: person.id,
      dni: person.dni,
      name: person.name,
      surname: person.surname,
      birthday: person.birthday,
      gender: person.gender,
      status: person.status,
    };
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona actualizada',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
  ): Promise<PersonDto> {
    const person = await this.personService.update(id, updatePersonDto);
    return {
      id: person.id,
      dni: person.dni,
      name: person.name,
      surname: person.surname,
      birthday: person.birthday,
      gender: person.gender,
      status: person.status,
    };
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una persona por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Persona eliminada',
  })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.personService.remove(id);
  }
}
