import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GymResponseDto, UserResponseDto } from './dto/response';
import { JwtPayload } from 'src/features/auth/dto/request';
import { GetUser } from 'src/features/auth/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  CreateCompetitionDto,
  FindCompetitionDto,
  UpdateCompetitionDto,
} from '../competition/dto/request';
import { CompetitionDto } from '../competition/dto/response';
import {
  CreateCompetitionDivisionDto,
  UpdateCompetitionDivisionDto,
} from '../competition-division/dto/request';
import { CreateUserDto, UpdateUserDto } from '../user/dto/request';
import { UserDto } from '../user/dto/response';
import { CreatePersonDto, UpdatePersonDto } from '../person/dto/request';
import { PersonDto } from '../person/dto/response';
import { CreateCoachDto } from '../coach/dto/request';
import { CreateAthleteDto } from '../athlete/dto/request';
import { UpdateGymPaymentDto } from '../gym-payment/dto/request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Admin')
@Controller('admin')
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== GET ====================

  @Get('')
  @ApiOperation({ summary: 'Verificar token de admin' })
  @ApiResponse({
    status: 200,
    description: 'Token valido, retorna payload del usuario',
  })
  test(@GetUser() user: JwtPayload) {
    return user;
  }

  @Get('/gyms')
  @ApiOperation({ summary: 'Obtener todos los gimnasios (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de gimnasios obtenida exitosamente',
    type: [GymResponseDto],
  })
  findAllGyms(): Promise<GymResponseDto[]> {
    return this.adminService.getAllGyms();
  }

  @Get('/users')
  @ApiOperation({ summary: 'Obtener todos los usuarios (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponseDto],
  })
  findAllUsers(): Promise<UserResponseDto[]> {
    return this.adminService.getAllUsers();
  }

  @Get('/users/paginated')
  @ApiOperation({ summary: 'Listar todos los usuarios paginados (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuarios',
  })
  async findAllUsersPaginated(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<UserDto>> {
    return this.adminService.findAllUsersPaginated(pagination);
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOneUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.adminService.findOneUser(id);
  }

  @Get('/persons/paginated')
  @ApiOperation({ summary: 'Listar todas las personas paginadas (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de personas',
  })
  async findAllPersonsPaginated(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<PersonDto>> {
    return this.adminService.findAllPersonsPaginated(pagination);
  }

  @Get('/persons/:id')
  @ApiOperation({ summary: 'Obtener persona por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Persona encontrada',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async findOnePerson(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PersonDto> {
    return this.adminService.findOnePerson(id);
  }

  @Get('/coaches/paginated')
  @ApiOperation({ summary: 'Listar todos los entrenadores paginados (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista paginada de entrenadores' })
  async findAllCoachesPaginated(@Query() pagination: PaginationDto) {
    return this.adminService.findAllCoachesPaginated(pagination);
  }

  @Get('/coaches/:id')
  @ApiOperation({ summary: 'Obtener entrenador por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Entrenador encontrado' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async findOneCoach(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOneCoach(id);
  }

  @Get('/athletes/paginated')
  @ApiOperation({ summary: 'Listar todos los atletas paginados (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista paginada de atletas' })
  async findAllAthletesPaginated(@Query() pagination: PaginationDto) {
    return this.adminService.findAllAthletesPaginated(pagination);
  }

  @Get('/athletes/:id')
  @ApiOperation({ summary: 'Obtener atleta por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Atleta encontrado' })
  @ApiResponse({ status: 404, description: 'Atleta no encontrado' })
  async findOneAthlete(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOneAthlete(id);
  }

  // ==================== COMPETITIONS GET ====================

  @Get('/competitions')
  @ApiOperation({ summary: 'Listar todas las competencias (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de competencias',
    type: [CompetitionDto],
  })
  async findAllCompetitions(
    @Query() dto: FindCompetitionDto,
  ): Promise<CompetitionDto[]> {
    return this.adminService.findAllCompetitions(dto);
  }

  @Get('/competitions/:id')
  @ApiOperation({ summary: 'Obtener competencia por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Competencia encontrada',
    type: CompetitionDto,
  })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  async findOneCompetition(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompetitionDto> {
    return this.adminService.findOneCompetition(id);
  }

  // ==================== COMPETITION DIVISIONS GET ====================

  @Get('/competition-divisions')
  @ApiOperation({
    summary: 'Listar todas las divisiones de competencia (Admin)',
  })
  @ApiResponse({ status: 200, description: 'Lista de divisiones' })
  async findAllCompetitionDivisions() {
    return this.adminService.findAllCompetitionDivisions();
  }

  @Get('/competition-divisions/:id')
  @ApiOperation({ summary: 'Obtener división por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'División encontrada' })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async findOneCompetitionDivision(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOneCompetitionDivision(id);
  }

  // ==================== POST ====================

  @Post('/competitions')
  @ApiOperation({ summary: 'Crear una nueva competencia (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Competencia creada exitosamente',
    type: CompetitionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  async createCompetition(
    @Body() dto: CreateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.adminService.createCompetition(dto);
  }

  @Post('/competition-divisions')
  @ApiOperation({ summary: 'Crear una división de competencia (Admin)' })
  @ApiResponse({ status: 201, description: 'División creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una division con los mismos parametros',
  })
  async createCompetitionDivision(@Body() dto: CreateCompetitionDivisionDto) {
    return this.adminService.createCompetitionDivision(dto);
  }

  @Post('/users')
  @ApiOperation({ summary: 'Crear un nuevo usuario (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 409, description: 'El email ya esta registrado' })
  async createUser(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.adminService.createUser(dto);
  }

  @Post('/persons')
  @ApiOperation({ summary: 'Crear una nueva persona (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Persona creada exitosamente',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 409, description: 'La cedula ya esta registrada' })
  async createPerson(@Body() dto: CreatePersonDto): Promise<PersonDto> {
    return this.adminService.createPerson(dto);
  }

  @Post('/coaches')
  @ApiOperation({ summary: 'Crear un nuevo entrenador (Admin)' })
  @ApiResponse({ status: 201, description: 'Entrenador creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un coach con esa cedula' })
  async createCoach(@Body() dto: CreateCoachDto) {
    return this.adminService.createCoach(dto);
  }

  @Post('/athletes')
  @ApiOperation({ summary: 'Crear un nuevo atleta (Admin)' })
  @ApiResponse({ status: 201, description: 'Atleta creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un atleta con esa cedula',
  })
  async createAthlete(@Body() dto: CreateAthleteDto) {
    return this.adminService.createAthlete(dto);
  }

  // ==================== PATCH ====================

  @Patch('/users/:id/status')
  @ApiOperation({ summary: 'Cambiar estado de usuario (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario cambiado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async changeUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.changeUserStatus(id);
  }

  @Patch('/competitions/:id')
  @ApiOperation({ summary: 'Actualizar competencia por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Competencia actualizada exitosamente',
    type: CompetitionDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  async updateCompetition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.adminService.updateCompetition(id, dto);
  }

  @Patch('/competition-divisions/:id')
  @ApiOperation({ summary: 'Actualizar división por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'División actualizada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async updateCompetitionDivision(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompetitionDivisionDto,
  ) {
    return this.adminService.updateCompetitionDivision(id, dto);
  }

  @Patch('/users/:id')
  @ApiOperation({ summary: 'Actualizar usuario por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.adminService.updateUser(id, dto);
  }

  @Patch('/persons/:id')
  @ApiOperation({ summary: 'Actualizar persona por ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Persona actualizada exitosamente',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async updatePerson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
  ): Promise<PersonDto> {
    return this.adminService.updatePerson(id, dto);
  }

  @Patch('/gym-payments/:id')
  @ApiOperation({ summary: 'Actualizar pago de gimnasio por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async updateGymPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGymPaymentDto,
  ) {
    return this.adminService.updateGymPayment(id, dto);
  }

  // ==================== DELETE ====================

  @Delete('/competitions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar competencia por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Competencia eliminada' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  async removeCompetition(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.removeCompetition(id);
  }

  @Delete('/competition-divisions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar división por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'División eliminada' })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async removeCompetitionDivision(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.removeCompetitionDivision(id);
  }

  @Delete('/users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async removeUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeUser(id);
  }

  @Delete('/persons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar persona por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Persona eliminada' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async removePerson(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removePerson(id);
  }

  @Delete('/coaches/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar entrenador por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Entrenador eliminado' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async removeCoach(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeCoach(id);
  }

  @Delete('/athletes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar atleta por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Atleta eliminado' })
  @ApiResponse({ status: 404, description: 'Atleta no encontrado' })
  async removeAthlete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeAthlete(id);
  }

  @Delete('/gyms/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar gimnasio por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Gimnasio eliminado' })
  @ApiResponse({ status: 404, description: 'Gimnasio no encontrado' })
  async removeGym(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeGym(id);
  }

  @Delete('/gym-payments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar pago de gimnasio por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Pago eliminado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async removeGymPayment(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.removeGymPayment(id);
  }
}
