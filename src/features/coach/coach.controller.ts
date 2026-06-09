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
  async create(
    @Body() createCoachDto: CreateCoachDto,
  ): Promise<CoachResponseDto> {
    return this.coachService.create(createCoachDto);
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
