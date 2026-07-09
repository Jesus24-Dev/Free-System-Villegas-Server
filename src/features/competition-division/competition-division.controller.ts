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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompetitionDivisionService } from './competition-division.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  CompetitionDivisionDto,
  CompetitionDivisionWithoutCompetitionDto,
} from './dto/response';
import {
  CreateCompetitionDivisionDto,
  UpdateCompetitionDivisionDto,
} from './dto/request';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Competition Division')
@Controller('competition-division')
export class CompetitionDivisionController {
  constructor(
    private readonly competitionDivisionService: CompetitionDivisionService,
  ) {}

  @Roles('ADMIN', 'COACH')
  @Post()
  @ApiOperation({
    summary: 'Registrar una modalidad del atleta en la competencia',
  })
  @ApiResponse({
    status: 201,
    description: 'Modalidad registrada con exito',
    type: CompetitionDivisionWithoutCompetitionDto,
  })
  async create(
    @Body() createCompetitionDivisionDto: CreateCompetitionDivisionDto,
  ): Promise<CompetitionDivisionWithoutCompetitionDto> {
    return this.competitionDivisionService.create(createCompetitionDivisionDto);
  }

  @Roles('ADMIN', 'COACH')
  @Get()
  @ApiOperation({
    summary:
      'Obtener todas las modalidades registradas en todas las competencias',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidades obtenidas con exito',
    type: [CompetitionDivisionDto],
  })
  async findAll(): Promise<CompetitionDivisionDto[]> {
    return this.competitionDivisionService.findAll();
  }

  @Roles('ADMIN', 'COACH')
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una modalidad registrada en especifico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad obtenida con exito',
    type: CompetitionDivisionDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompetitionDivisionDto> {
    return this.competitionDivisionService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una modalidad registrada por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad actualizada con exito',
    type: CompetitionDivisionWithoutCompetitionDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompetitionDivisionDto: UpdateCompetitionDivisionDto,
  ): Promise<CompetitionDivisionWithoutCompetitionDto> {
    return this.competitionDivisionService.update(
      id,
      updateCompetitionDivisionDto,
    );
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una modalidad registrada por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad eliminar con exito',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.competitionDivisionService.remove(id);
  }
}
