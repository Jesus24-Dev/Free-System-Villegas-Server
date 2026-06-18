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
} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import {
  CreateCompetitionDto,
  CompetitionResponseDto,
} from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { FindCompetitionDto } from './dto/find-competition.dto';
import { RegisterAthleteAtCompetitionUseCase } from './use-cases/register-athlete-at-competition.use-case';
import { RegisterAthleteAtCompetitionDto } from './dto/register-athlete-at-competition.dto';

@ApiTags('Competition')
@Controller('competition')
export class CompetitionController {
  constructor(
    private readonly competitionService: CompetitionService,
    private readonly registerAthleteAtCompetitionUseCase: RegisterAthleteAtCompetitionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva competencia' })
  @ApiResponse({
    status: 201,
    description: 'Competencia creada exitosamente',
    type: CompetitionResponseDto,
  })
  async create(
    @Body() createCompetitionDto: CreateCompetitionDto,
  ): Promise<CompetitionResponseDto> {
    return this.competitionService.create(createCompetitionDto);
  }

  @Post(':competitionId/athletes/:athleteId/register')
  @ApiOperation({ summary: 'Registrar atleta en una competencia' })
  @ApiResponse({
    status: 201,
    description: 'Atleta registrado exitosamente',
    type: RegisterAthleteAtCompetitionDto,
  })
  registerAthlete(
    @Param('competitionId') competitionId: string,
    @Param('athleteId') athleteId: string,
    @Body() dto: RegisterAthleteAtCompetitionDto,
  ) {
    return this.registerAthleteAtCompetitionUseCase.execute(
      dto,
      competitionId,
      athleteId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las competencias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de las competencias',
    type: [CompetitionResponseDto],
  })
  async findAll(
    @Query() status: FindCompetitionDto,
  ): Promise<CompetitionResponseDto[]> {
    return this.competitionService.findAll(status);
  }

  @Get(':id')
  @Get()
  @ApiOperation({ summary: 'Obtener competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia encontrada',
    type: CompetitionResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CompetitionResponseDto> {
    return this.competitionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia actualizada con exito',
    type: CompetitionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<CompetitionResponseDto> {
    return this.competitionService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar competencia por ID' })
  @ApiResponse({
    status: 204,
    description: 'Competencia eliminada',
    type: CompetitionResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.competitionService.remove(id);
  }
}
