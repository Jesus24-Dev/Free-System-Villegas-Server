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
  Res,
  ParseUUIDPipe,
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
import { Roles } from 'src/common/decorators/roles.decorator';
import type { Response } from 'express';

@ApiTags('Competition')
@Controller('competition')
export class CompetitionController {
  constructor(
    private readonly competitionService: CompetitionService,
    private readonly registerAthleteAtCompetitionUseCase: RegisterAthleteAtCompetitionUseCase,
  ) {}

  @Roles('ADMIN', 'COACH', 'ATHLETE')
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

  @Roles('ADMIN', 'COACH')
  @Get(':competitionId/export/:gymId')
  @ApiOperation({
    summary:
      'Exportar atletas inscritos de un gimnasio en una competencia (Excel)',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel con la lista de atletas inscritos',
  })
  @ApiResponse({
    status: 404,
    description: 'Competencia o gimnasio no encontrado',
  })
  async exportAthletesByGym(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.competitionService.exportAthletesByGym(
      competitionId,
      gymId,
      res,
    );
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia encontrada',
    type: CompetitionDto,
  })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompetitionDto> {
    return this.competitionService.findOne(id);
  }

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva competencia' })
  @ApiResponse({
    status: 201,
    description: 'Competencia creada exitosamente',
    type: CompetitionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  async create(
    @Body() createCompetitionDto: CreateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.competitionService.create(createCompetitionDto);
  }

  @Roles('ADMIN', 'COACH')
  @Post(':competitionId/athletes/:athleteId/register')
  @ApiOperation({ summary: 'Registrar atleta en una competencia' })
  @ApiResponse({
    status: 201,
    description: 'Atleta registrado exitosamente',
    type: RegisterAthleteAtCompetitionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({
    status: 404,
    description: 'Competencia o atleta no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El atleta ya esta registrado en esta competencia',
  })
  registerAthlete(
    @Param('competitionId', ParseUUIDPipe) competitionId: string,
    @Param('athleteId', ParseUUIDPipe) athleteId: string,
    @Body() dto: RegisterAthleteAtCompetitionDto,
  ) {
    return this.registerAthleteAtCompetitionUseCase.execute(
      dto,
      competitionId,
      athleteId,
    );
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar competencia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Competencia actualizada con exito',
    type: CompetitionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.competitionService.update(id, updateCompetitionDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar competencia por ID' })
  @ApiResponse({
    status: 204,
    description: 'Competencia eliminada',
  })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.competitionService.remove(id);
  }
}
