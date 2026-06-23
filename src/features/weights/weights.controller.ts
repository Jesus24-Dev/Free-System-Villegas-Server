import { Controller, Get, Query } from '@nestjs/common';
import { WeightsService } from './weights.service';
import { WeightsFilterDto, WeightResponseDto } from './dto/weights-filter.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Weights')
@Controller('weights')
export class WeightsController {
  constructor(private readonly weightsService: WeightsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener pesos filtrados',
    description:
      'Retorna una lista de pesos deportivos permitiendo filtrar de forma combinada por modo, género y categoría a través de la URL.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pesos obtenida exitosamente.',
    type: [WeightResponseDto],
  })
  async findAll(
    @Query() filterDto: WeightsFilterDto,
  ): Promise<WeightResponseDto[]> {
    return this.weightsService.findAll(filterDto);
  }
}
