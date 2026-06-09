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
import { CreatePersonDto, PersonResponseDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva persona' })
  @ApiResponse({
    status: 201,
    description: 'La persona ha sido creada exitosamente',
    type: PersonResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) createPersonDto: CreatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personService.create(createPersonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las personas',
    type: [PersonResponseDto],
  })
  async findAll(): Promise<PersonResponseDto[]> {
    return this.personService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona encontrada',
    type: PersonResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<PersonResponseDto> {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona actualizada',
    type: PersonResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personService.update(id, updatePersonDto);
  }

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
