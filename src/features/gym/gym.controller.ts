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
import { GymService } from './gym.service';
import { CreateGymDto, GymResponseDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Gym')
@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo gimnasio exitosamente',
    type: GymResponseDto,
  })
  create(@Body(new ValidationPipe()) createGymDto: CreateGymDto) {
    return this.gymService.create(createGymDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gimnasios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gimnasios conseguida exitosamente',
    type: [GymResponseDto],
  })
  findAll() {
    return this.gymService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio conseguido exitosamente',
    type: GymResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.gymService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio actualizado exitosamente',
    type: GymResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateGymDto: UpdateGymDto,
  ) {
    return this.gymService.update(id, updateGymDto);
  }

  @ApiOperation({ summary: 'Eliminar un gimnasio por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Gimnasio eliminado exitosamente',
    type: GymResponseDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymService.remove(id);
  }
}
