import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FightModeService } from './fight-mode.service';
import {
  CreateFightModeDto,
  FightModeResponseDto,
} from './dto/create-fight-mode.dto';
import { UpdateFightModeDto } from './dto/update-fight-mode.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Fight Mode')
@Controller('fight-mode')
export class FightModeController {
  constructor(private readonly fightModeService: FightModeService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar una modalidad del atleta en la competencia',
  })
  @ApiResponse({
    status: 201,
    description: 'Modalidad registrada con exito',
    type: FightModeResponseDto,
  })
  create(@Body() createFightModeDto: CreateFightModeDto) {
    return this.fightModeService.create(createFightModeDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Obtener todas las modalidades registradas en todas las competencias',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidades obtenidas con exito',
    type: [FightModeResponseDto],
  })
  findAll() {
    return this.fightModeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una modalidad registrada en especifico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad obtenida con exito',
    type: FightModeResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.fightModeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una modalidad registrada por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad actualizada con exito',
    type: FightModeResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateFightModeDto: UpdateFightModeDto,
  ) {
    return this.fightModeService.update(id, updateFightModeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una modalidad registrada por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Modalidad eliminar con exito',
    type: FightModeResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.fightModeService.remove(id);
  }
}
