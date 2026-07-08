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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompetitionRegistrationService } from './competition-registration.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  CreateCompetitionRegistrationDto,
  UpdateCompetitionRegistrationDto,
} from './dto/request';
import { CompetitionRegistrationResponseDto } from './dto/response';
import { RawCompetitionRegistrationDto } from './dto/response/raw-competition-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Competition Registration')
@Controller('competition-registration')
export class CompetitionRegistrationController {
  constructor(
    private readonly competitionRegistrationService: CompetitionRegistrationService,
  ) {}

  @Roles('ADMIN', 'COACH')
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

  @Roles('ADMIN', 'COACH')
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los registros de competencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros encontrada',
    type: [CompetitionRegistrationResponseDto],
  })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CompetitionRegistrationResponseDto>> {
    return this.competitionRegistrationService.findAll(pagination);
  }

  @Roles('ADMIN', 'COACH')
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
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompetitionRegistrationResponseDto> {
    return this.competitionRegistrationService.findOne(id);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro por ID' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado',
    type: RawCompetitionRegistrationDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompetitionRegistrationDto: UpdateCompetitionRegistrationDto,
  ): Promise<RawCompetitionRegistrationDto> {
    return this.competitionRegistrationService.update(
      id,
      updateCompetitionRegistrationDto,
    );
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un registro por ID' })
  @ApiResponse({
    status: 204,
    description: 'Registro eliminado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.competitionRegistrationService.remove(id);
  }
}
