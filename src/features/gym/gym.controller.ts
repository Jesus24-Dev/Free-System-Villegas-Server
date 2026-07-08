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
  ParseUUIDPipe,
} from '@nestjs/common';
import { GymService } from './gym.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateGymUseCase } from './use-cases/create-gym.use-case';
import { JwtPayload } from '../auth/dto/request';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GymDto, RawGymDto } from './dto/response';
import { CreateGymDto, UpdateGymDto } from './dto/request';
import { GymDetailsResponseDto } from './dto/response/gym-details-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Gym')
@Controller('gym')
export class GymController {
  constructor(
    private readonly gymService: GymService,
    private readonly gymUseCase: CreateGymUseCase,
  ) {}

  @Roles('ADMIN', 'COACH')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo gimnasio exitosamente',
    type: RawGymDto,
  })
  async create(
    @Body(new ValidationPipe()) createGymDto: CreateGymDto,
    @GetUser() user: JwtPayload,
  ): Promise<RawGymDto> {
    return this.gymUseCase.execute(user.sub, createGymDto);
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los gimnasios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gimnasios conseguida exitosamente',
    type: [GymDto],
  })
  async findAll(): Promise<GymDto[]> {
    return this.gymService.findAll();
  }

  @Roles('ADMIN', 'COACH', 'ATHLETE')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio conseguido exitosamente',
    type: GymDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GymDto> {
    return this.gymService.findOne(id);
  }

  @Roles('ADMIN', 'COACH')
  @Get(':gymId/details')
  @ApiOperation({ summary: 'Obtener un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio conseguido exitosamente',
    type: GymDetailsResponseDto,
  })
  async getGymDetails(
    @Param('gymId', ParseUUIDPipe) gymId: string,
  ): Promise<GymDetailsResponseDto> {
    return this.gymService.getGymDetails(gymId);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gimnasio por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio actualizado exitosamente',
    type: RawGymDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateGymDto: UpdateGymDto,
  ): Promise<RawGymDto> {
    return this.gymService.update(id, updateGymDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un gimnasio por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Gimnasio eliminado exitosamente',
    type: RawGymDto,
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.gymService.remove(id);
  }
}
