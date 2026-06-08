import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  create(@Body() createGymPaymentDto: CreateGymPaymentDto) {
    return this.gymPaymentService.create(createGymPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos de todos los gimnasios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos',
    type: [GymPaymentResponseDto],
  })
  findAll() {
    return this.gymPaymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago en especifico' })
  @ApiResponse({
    status: 200,
    description: 'Pago obtenido',
    type: GymPaymentResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.gymPaymentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado',
    type: GymPaymentResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateGymPaymentDto: UpdateGymPaymentDto,
  ) {
    return this.gymPaymentService.update(id, updateGymPaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Pago eliminado',
    type: GymPaymentResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.gymPaymentService.remove(id);
  }
}
