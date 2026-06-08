import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AthleteRegisterService } from './athlete-register.service';
import {
  CreateAthleteRegisterDto,
  AthleteRegisterResponseDto,
} from './dto/create-athlete-register.dto';
import { UpdateAthleteRegisterDto } from './dto/update-athlete-register.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Athlete Register')
@Controller('athlete-register')
export class AthleteRegisterController {
  constructor(
    private readonly athleteRegisterService: AthleteRegisterService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un atleta en una competencia' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo usuario exitosamente',
    type: AthleteRegisterResponseDto,
  })
  create(@Body() createAthleteRegisterDto: CreateAthleteRegisterDto) {
    return this.athleteRegisterService.create(createAthleteRegisterDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los atletas registrados en todas las competencias',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros encontrada',
    type: [AthleteRegisterResponseDto],
  })
  findAll() {
    return this.athleteRegisterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de atleta especifico por ID' })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado',
    type: AthleteRegisterResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.athleteRegisterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro por ID' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado',
    type: AthleteRegisterResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateAthleteRegisterDto: UpdateAthleteRegisterDto,
  ) {
    return this.athleteRegisterService.update(id, updateAthleteRegisterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro por ID' })
  @ApiResponse({
    status: 204,
    description: 'Registro eliminado',
    type: AthleteRegisterResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.athleteRegisterService.remove(id);
  }
}
