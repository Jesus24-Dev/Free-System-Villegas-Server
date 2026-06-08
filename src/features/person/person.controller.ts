import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
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
  create(@Body(new ValidationPipe()) createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las personas',
    type: [PersonResponseDto],
  })
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona encontrada',
    type: PersonResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una persona por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona actualizada',
    type: PersonResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updatePersonDto: UpdatePersonDto,
  ) {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una persona por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Persona eliminada',
  })
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }
}
