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
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { RegisterAthleteAtCompetitionUseCase } from './use-cases/register-athlete-at-competition.use-case';
import {
  CreateCompetitionDto,
  FindCompetitionDto,
  RegisterAthleteAtCompetitionDto,
  UpdateCompetitionDto,
} from './dto/request';
import { CompetitionDto } from './dto/response';

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
    type: CompetitionDto,
  })
  async create(
    @Body() createCompetitionDto: CreateCompetitionDto,
  ): Promise<CompetitionDto> {
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
    type: [CompetitionDto],
  })
  async findAll(
    @Query() status: FindCompetitionDto,
  ): Promise<CompetitionDto[]> {
    return this.competitionService.findAll(status);
  }

  @Get(':id')
  @Get()
  @ApiOperation({ summary: 'Obtener competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia encontrada',
    type: CompetitionDto,
  })
  async findOne(@Param('id') id: string): Promise<CompetitionDto> {
    return this.competitionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia actualizada con exito',
    type: CompetitionDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.competitionService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar competencia por ID' })
  @ApiResponse({
    status: 204,
    description: 'Competencia eliminada',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.competitionService.remove(id);
  }
}
