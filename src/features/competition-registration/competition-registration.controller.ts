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
import { CompetitionRegistrationService } from './competition-registration.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  CreateCompetitionRegistrationDto,
  UpdateCompetitionRegistrationDto,
} from './dto/request';
import { CompetitionRegistrationResponseDto } from './dto/response';
import { RawCompetitionRegistrationDto } from './dto/response/raw-competition-response.dto';

@ApiTags('Competition Registration')
@Controller('competition-registration')
export class CompetitionRegistrationController {
  constructor(
    private readonly competitionRegistrationService: CompetitionRegistrationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un atleta en una competencia' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo usuario exitosamente',
    type: RawCompetitionRegistrationDto,
  })
  async create(
    @Body() createCompetitionRegistrationDto: CreateCompetitionRegistrationDto,
  ): Promise<RawCompetitionRegistrationDto> {
    return this.competitionRegistrationService.create(
      createCompetitionRegistrationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los registros de competencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros encontrada',
    type: [CompetitionRegistrationResponseDto],
  })
  async findAll(): Promise<CompetitionRegistrationResponseDto[]> {
    return this.competitionRegistrationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un registro de competencia especifico por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado',
    type: CompetitionRegistrationResponseDto,
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<CompetitionRegistrationResponseDto> {
    return this.competitionRegistrationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro por ID' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado',
    type: RawCompetitionRegistrationDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionRegistrationDto: UpdateCompetitionRegistrationDto,
  ): Promise<RawCompetitionRegistrationDto> {
    return this.competitionRegistrationService.update(
      id,
      updateCompetitionRegistrationDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un registro por ID' })
  @ApiResponse({
    status: 204,
    description: 'Registro eliminado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.competitionRegistrationService.remove(id);
  }
}
