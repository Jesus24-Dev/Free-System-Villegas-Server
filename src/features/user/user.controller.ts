import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserDto } from './dto/response';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Crear un nuevo usuario exitosamente',
    type: UserDto,
  })
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.create(createUserDto);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      person_id: user.person_id,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Los usuarios han sido encontrados exitosamente',
    type: [UserDto],
  })
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      person_id: user.person_id,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido encontrado exitosamente',
    type: UserDto,
  })
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.findOne(id);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      person_id: user.person_id,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente',
    type: UserDto,
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.update(id, updateUserDto);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      person_id: user.person_id,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario existente' })
  @ApiResponse({
    status: 204,
    description: 'El usuario ha sido eliminado exitosamente',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
