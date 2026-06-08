import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import {
  CreateCompetitionDto,
  CompetitionResponseDto,
} from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Competition')
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva competencia' })
  @ApiResponse({
    status: 201,
    description: 'Competencia creada exitosamente',
    type: CompetitionResponseDto,
  })
  create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionService.create(createCompetitionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las competencias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de las competencias',
    type: [CompetitionResponseDto],
  })
  findAll() {
    return this.competitionService.findAll();
  }

  @Get(':id')
  @Get()
  @ApiOperation({ summary: 'Obtener competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia encontrada',
    type: CompetitionResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.competitionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia actualizada con exito',
    type: CompetitionResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return this.competitionService.update(id, updateCompetitionDto);
  }

  @ApiOperation({ summary: 'Eliminar competencia por ID' })
  @ApiResponse({
    status: 204,
    description: 'Competencia eliminada',
    type: CompetitionResponseDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionService.remove(id);
  }
}
