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
import {
  CreateCompetitionRegistrationDto,
  CompetitionRegistrationResponseDto,
} from './dto/create-competition-registration.dto';
import { UpdateCompetitionRegistrationDto } from './dto/update-competition-registration.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Athlete Register')
@Controller('athlete-register')
export class CompetitionRegistrationController {
  constructor(
    private readonly competitionRegistrationService: CompetitionRegistrationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un atleta en una competencia' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo usuario exitosamente',
    type: CompetitionRegistrationResponseDto,
  })
  async create(
    @Body() createCompetitionRegistrationDto: CreateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistrationResponseDto> {
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
    type: CompetitionRegistrationResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionRegistrationDto: UpdateCompetitionRegistrationDto,
  ): Promise<CompetitionRegistrationResponseDto> {
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
    type: CompetitionRegistrationResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.competitionRegistrationService.remove(id);
  }
}
