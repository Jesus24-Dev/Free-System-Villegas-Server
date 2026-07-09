import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PagoMovilService } from './pago-movil.service';
import { CreatePagoMovilDto } from './dto/request/create-pago-movil.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagoMovilResponseDto } from './dto/responses/pago-movil-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Pago Movil')
@Controller('pago-movil')
export class PagoMovilController {
  constructor(private readonly pagoMovilService: PagoMovilService) {}

  @Roles('ADMIN', 'COACH')
  @Post(':gymId')
  @ApiOperation({
    summary: 'Crear un nuevo método de pago móvil para un gimnasio',
  })
  @ApiResponse({
    status: 201,
    description: 'El método de pago móvil ha sido creado.',
    type: PagoMovilResponseDto,
  })
  create(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Body() createPagoMovilDto: CreatePagoMovilDto,
  ): Promise<PagoMovilResponseDto> {
    return this.pagoMovilService.create(gymId, createPagoMovilDto);
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get(':gymId')
  @ApiOperation({
    summary: 'Obtener todos los datos de pago movil de un gimnasio',
  })
  @ApiResponse({
    status: 200,
    description: 'Los datos han sido devueltos.',
    type: [PagoMovilResponseDto],
  })
  findByGym(
    @Param('gymId', ParseUUIDPipe) gymId: string,
  ): Promise<PagoMovilResponseDto[]> {
    return this.pagoMovilService.findByGym(gymId);
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un dato de pago movil especifico',
  })
  @ApiResponse({
    status: 200,
    description: 'El dato ha sido devuelto.',
    type: PagoMovilResponseDto,
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PagoMovilResponseDto> {
    return this.pagoMovilService.findOne(id);
  }

  @Roles('ADMIN', 'COACH')
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.pagoMovilService.remove(id);
  }
}
