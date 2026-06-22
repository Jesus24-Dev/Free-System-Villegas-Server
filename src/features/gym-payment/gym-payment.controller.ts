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
import { GymPaymentService } from './gym-payment.service';
import {
  CreateGymPaymentDto,
  GymPaymentResponseDto,
} from './dto/create-gym-payment.dto';
import { UpdateGymPaymentDto } from './dto/update-gym-payment.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Gym Payment')
@Controller('gym-payment')
export class GymPaymentController {
  constructor(private readonly gymPaymentService: GymPaymentService) {}

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

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos de todos los gimnasios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos',
    type: [GymPaymentResponseDto],
  })
  async findAll(): Promise<GymPaymentResponseDto[]> {
    return this.gymPaymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago en especifico' })
  @ApiResponse({
    status: 200,
    description: 'Pago obtenido',
    type: GymPaymentResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<GymPaymentResponseDto> {
    return this.gymPaymentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado',
    type: GymPaymentResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateGymPaymentDto: UpdateGymPaymentDto,
  ): Promise<GymPaymentResponseDto> {
    return this.gymPaymentService.update(id, updateGymPaymentDto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar un pago por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago confirmado',
  })
  async confirmPayment(@Param('id') id: string): Promise<void> {
    await this.gymPaymentService.confirmPayment(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pago por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Pago eliminado',
    type: GymPaymentResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.gymPaymentService.remove(id);
  }
}
