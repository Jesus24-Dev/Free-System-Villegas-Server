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
import { CreateGymPaymentDto } from './dto/create-gym-payment.dto';
import { UpdateGymPaymentDto } from './dto/update-gym-payment.dto';

@Controller('gym-payment')
export class GymPaymentController {
  constructor(private readonly gymPaymentService: GymPaymentService) {}

  @Post()
  create(@Body() createGymPaymentDto: CreateGymPaymentDto) {
    return this.gymPaymentService.create(createGymPaymentDto);
  }

  @Get()
  findAll() {
    return this.gymPaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymPaymentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGymPaymentDto: UpdateGymPaymentDto,
  ) {
    return this.gymPaymentService.update(id, updateGymPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymPaymentService.remove(id);
  }
}
