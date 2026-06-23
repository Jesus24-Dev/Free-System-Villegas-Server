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
} from '@nestjs/common';
import { PersonService } from './person.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { PersonDto, PersonFoundedResponseDto } from './dto/response';
import { CreatePersonDto, UpdatePersonDto } from './dto/request';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva persona' })
  @ApiResponse({
    status: 201,
    description: 'La persona ha sido creada exitosamente',
    type: PersonDto,
  })
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
  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las personas',
    type: [PersonDto],
  })
  async findAll(): Promise<PersonDto[]> {
    const persons = await this.personService.findAll();

    return persons.map((person) => ({
      id: person.id,
      dni: person.dni,
      name: person.name,
      surname: person.surname,
      birthday: person.birthday,
      gender: person.gender,
      status: person.status,
    }));
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona encontrada',
    type: PersonDto,
  })
  async findOne(@Param('id') id: string): Promise<PersonDto> {
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

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona actualizada',
    type: PersonDto,
  })
  async update(
    @Param('id') id: string,
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
  async remove(@Param('id') id: string) {
    await this.personService.remove(id);
  }
}
