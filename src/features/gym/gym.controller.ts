import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto, GymResponseDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateGymUseCase } from './use-cases/create-gym.use-case';
import { GetUser } from '../auth/dto/decorators/get-user.decorator';
import { JwtPayload } from '../auth/dto/auth.dto';

@ApiTags('Gym')
@Controller('gym')
export class GymController {
  constructor(
    private readonly gymService: GymService,
    private readonly gymUseCase: CreateGymUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo gimnasio exitosamente',
    type: GymResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) createGymDto: CreateGymDto,
    @GetUser() user: JwtPayload,
  ): Promise<GymResponseDto> {
    return this.gymUseCase.execute(user.sub, createGymDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gimnasios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gimnasios conseguida exitosamente',
    type: [GymResponseDto],
  })
  async findAll(): Promise<GymResponseDto[]> {
    return this.gymService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio conseguido exitosamente',
    type: GymResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<GymResponseDto> {
    return this.gymService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio actualizado exitosamente',
    type: GymResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateGymDto: UpdateGymDto,
  ): Promise<GymResponseDto> {
    return this.gymService.update(id, updateGymDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un gimnasio por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Gimnasio eliminado exitosamente',
    type: GymResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.gymService.remove(id);
  }
}
