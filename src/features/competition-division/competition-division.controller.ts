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
import { CompetitionDivisionService } from './competition-division.service';
import {
  CreateCompetitionDivisionDto,
  CompetitionDivisionResponseDto,
} from './dto/create-competition-division.dto';
import { UpdateCompetitionDivisionDto } from './dto/update-competition-division.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Fight Mode')
@Controller('fight-mode')
export class CompetitionDivisionController {
  constructor(
    private readonly competitionDivisionService: CompetitionDivisionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar una modalidad del atleta en la competencia',
  })
  @ApiResponse({
    status: 201,
    description: 'Modalidad registrada con exito',
    type: CompetitionDivisionResponseDto,
  })
  async create(
    @Body() createCompetitionDivisionDto: CreateCompetitionDivisionDto,
  ): Promise<CompetitionDivisionResponseDto> {
    return this.competitionDivisionService.create(createCompetitionDivisionDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Obtener todas las modalidades registradas en todas las competencias',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidades obtenidas con exito',
    type: [CompetitionDivisionResponseDto],
  })
  async findAll(): Promise<CompetitionDivisionResponseDto[]> {
    return this.competitionDivisionService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una modalidad registrada en especifico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad obtenida con exito',
    type: CompetitionDivisionResponseDto,
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<CompetitionDivisionResponseDto> {
    return this.competitionDivisionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una modalidad registrada por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad actualizada con exito',
    type: CompetitionDivisionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionDivisionDto: UpdateCompetitionDivisionDto,
  ): Promise<CompetitionDivisionResponseDto> {
    return this.competitionDivisionService.update(
      id,
      updateCompetitionDivisionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una modalidad registrada por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad eliminar con exito',
    type: CompetitionDivisionResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.competitionDivisionService.remove(id);
  }
}
