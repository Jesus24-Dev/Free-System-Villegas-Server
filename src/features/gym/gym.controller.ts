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
import { UpdateGymByOwnerUseCase } from './use-cases/update-gym-by-owner.use-case';
import { JwtPayload } from '../auth/dto/request';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GymDto, RawGymDto } from './dto/response';
import { CreateGymDto, UpdateGymByOwnerDto } from './dto/request';
import { GymDetailsResponseDto } from './dto/response/gym-details-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Gym')
@Controller('gym')
export class GymController {
  constructor(
    private readonly gymService: GymService,
    private readonly gymUseCase: CreateGymUseCase,
    private readonly updateGymByOwnerUseCase: UpdateGymByOwnerUseCase,
  ) {}

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
  @ApiResponse({ status: 404, description: 'Gimnasio no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GymDto> {
    return this.gymService.findOne(id);
  }

  @Roles('ADMIN', 'COACH')
  @Get(':gymId/details')
  @ApiOperation({ summary: 'Obtener detalles completos de un gimnasio' })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio conseguido exitosamente',
    type: GymDetailsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Gimnasio no encontrado' })
  async getGymDetails(
    @Param('gymId', ParseUUIDPipe) gymId: string,
  ): Promise<GymDetailsResponseDto> {
    return this.gymService.getGymDetails(gymId);
  }

  @Roles('ADMIN', 'COACH')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gimnasio' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo gimnasio exitosamente',
    type: RawGymDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un gimnasio con ese nombre',
  })
  async create(
    @Body(new ValidationPipe()) createGymDto: CreateGymDto,
    @GetUser() user: JwtPayload,
  ): Promise<RawGymDto> {
    return this.gymUseCase.execute(user.sub, createGymDto);
  }

  @Roles('ADMIN', 'COACH')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un gimnasio por su ID',
    description:
      'Permite al dueno del gimnasio o un administrador actualizar los datos del gimnasio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Gimnasio actualizado exitosamente',
    type: RawGymDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({
    status: 403,
    description: 'No eres el dueno del gimnasio',
  })
  @ApiResponse({
    status: 404,
    description: 'Gimnasio no encontrado',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateGymDto: UpdateGymByOwnerDto,
    @GetUser() user: JwtPayload,
  ): Promise<RawGymDto> {
    const gym = await this.updateGymByOwnerUseCase.execute(
      id,
      user.sub,
      updateGymDto,
    );
    return gym;
  }

  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un gimnasio por su ID' })
  @ApiResponse({
    status: 204,
    description: 'Gimnasio eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Gimnasio no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.gymService.remove(id);
  }
}
