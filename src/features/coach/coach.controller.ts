import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoachService } from './coach.service';
import { CreateCoachDto, CoachResponseDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Coach')
@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}
  @ApiOperation({ summary: 'Crear un nuevo coach' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo coach exitosamente',
    type: CoachResponseDto,
  })
  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los atletas' })
  @ApiResponse({
    status: 200,
    description: 'Obtener lista de atletas registrados',
    type: [CoachResponseDto],
  })
  findAll() {
    return this.coachService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un atleta por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener solo un atleta por su identificador',
    type: CoachResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.coachService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar coach' })
  @ApiResponse({
    status: 200,
    description: 'Actualizar datos del coach',
    type: CoachResponseDto,
  })
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachService.update(id, updateCoachDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar coach' })
  @ApiResponse({
    status: 204,
    description: 'Eliminar un coach de la base de datos',
    type: CoachResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.coachService.remove(id);
  }
}
