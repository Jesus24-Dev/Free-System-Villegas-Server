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
import { GymPaymentService } from './gym-payment.service';
import { CreateGymPaymentDto } from './dto/request';
import { UpdateGymPaymentDto } from './dto/request';
import { FilterGymPaymentDto } from './dto/request';
import { GymPaymentResponseDto } from './dto/response';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Gym Payment')
@Controller('gym-payment')
export class GymPaymentController {
  constructor(private readonly gymPaymentService: GymPaymentService) {}

  @Roles('ADMIN', 'ATHLETE')
  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo pago por un atleta' })
  @ApiResponse({
    status: 201,
    description: 'Pago registrado con exito',
    type: GymPaymentResponseDto,
  })
  async create(
    @Body() createGymPaymentDto: CreateGymPaymentDto,
  ): Promise<GymPaymentResponseDto> {
    return this.gymPaymentService.create(createGymPaymentDto);
  }

  @Roles('ADMIN', 'COACH')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos de todos los gimnasios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos',
    type: [GymPaymentResponseDto],
  })
  async findAll(
    @Query() filter: FilterGymPaymentDto,
  ): Promise<PaginatedResponseDto<GymPaymentResponseDto>> {
    return this.gymPaymentService.findAll(filter);
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago en especifico' })
  @ApiResponse({
    status: 200,
    description: 'Pago obtenido',
    type: GymPaymentResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GymPaymentResponseDto> {
    return this.gymPaymentService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado',
    type: GymPaymentResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGymPaymentDto: UpdateGymPaymentDto,
  ): Promise<GymPaymentResponseDto> {
    return this.gymPaymentService.update(id, updateGymPaymentDto);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirmar un pago por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago confirmado',
  })
  async confirmPayment(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.gymPaymentService.confirmPayment(id);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pago por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Pago eliminado',
    type: GymPaymentResponseDto,
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.gymPaymentService.remove(id);
  }
}
