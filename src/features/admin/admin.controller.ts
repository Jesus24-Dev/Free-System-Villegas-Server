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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Admin')
@Controller('admin')
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/gyms')
  findAllGyms(): Promise<GymResponseDto[]> {
    return this.adminService.getAllGyms();
  }

  @Get('/users')
  findAllUsers(): Promise<UserResponseDto[]> {
    return this.adminService.getAllUsers();
  }

  @Patch('/users/:id/status')
  async changeUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.changeUserStatus(id);
  }

  @Get('')
  test(@GetUser() user: JwtPayload) {
    return user;
  }

  // ==================== COMPETITIONS ====================

  @Post('/competitions')
  @ApiOperation({ summary: 'Create a new competition (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Competition created successfully',
    type: CompetitionDto,
  })
  async createCompetition(
    @Body() dto: CreateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.adminService.createCompetition(dto);
  }

  @Get('/competitions')
  @ApiOperation({ summary: 'List all competitions (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of competitions',
    type: [CompetitionDto],
  })
  async findAllCompetitions(
    @Query() dto: FindCompetitionDto,
  ): Promise<CompetitionDto[]> {
    return this.adminService.findAllCompetitions(dto);
  }

  @Get('/competitions/:id')
  @ApiOperation({ summary: 'Get competition by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Competition found',
    type: CompetitionDto,
  })
  async findOneCompetition(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompetitionDto> {
    return this.adminService.findOneCompetition(id);
  }

  @Patch('/competitions/:id')
  @ApiOperation({ summary: 'Update competition by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Competition updated successfully',
    type: CompetitionDto,
  })
  async updateCompetition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompetitionDto,
  ): Promise<CompetitionDto> {
    return this.adminService.updateCompetition(id, dto);
  }

  @Delete('/competitions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete competition by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Competition deleted' })
  async removeCompetition(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.removeCompetition(id);
  }

  // ==================== COMPETITION DIVISIONS ====================

  @Post('/competition-divisions')
  @ApiOperation({ summary: 'Create a competition division (Admin)' })
  @ApiResponse({ status: 201, description: 'Division created successfully' })
  async createCompetitionDivision(
    @Body() dto: CreateCompetitionDivisionDto,
  ) {
    return this.adminService.createCompetitionDivision(dto);
  }

  @Get('/competition-divisions')
  @ApiOperation({ summary: 'List all competition divisions (Admin)' })
  @ApiResponse({ status: 200, description: 'List of divisions' })
  async findAllCompetitionDivisions() {
    return this.adminService.findAllCompetitionDivisions();
  }

  @Get('/competition-divisions/:id')
  @ApiOperation({ summary: 'Get division by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Division found' })
  async findOneCompetitionDivision(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.findOneCompetitionDivision(id);
  }

  @Patch('/competition-divisions/:id')
  @ApiOperation({ summary: 'Update division by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Division updated successfully' })
  async updateCompetitionDivision(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompetitionDivisionDto,
  ) {
    return this.adminService.updateCompetitionDivision(id, dto);
  }

  @Delete('/competition-divisions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete division by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Division deleted' })
  async removeCompetitionDivision(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.adminService.removeCompetitionDivision(id);
  }

  // ==================== USERS ====================

  @Post('/users')
  @ApiOperation({ summary: 'Create a new user (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDto,
  })
  async createUser(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.adminService.createUser(dto);
  }

  @Get('/users/paginated')
  @ApiOperation({ summary: 'List all users paginated (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users',
  })
  async findAllUsersPaginated(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<UserDto>> {
    return this.adminService.findAllUsersPaginated(pagination);
  }

  @Get('/users/:id')
  @ApiOperation({ summary: 'Get user by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserDto,
  })
  async findOneUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.adminService.findOneUser(id);
  }

  @Patch('/users/:id')
  @ApiOperation({ summary: 'Update user by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('/users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async removeUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeUser(id);
  }

  // ==================== PERSONS ====================

  @Post('/persons')
  @ApiOperation({ summary: 'Create a new person (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Person created successfully',
    type: PersonDto,
  })
  async createPerson(@Body() dto: CreatePersonDto): Promise<PersonDto> {
    return this.adminService.createPerson(dto);
  }

  @Get('/persons/paginated')
  @ApiOperation({ summary: 'List all persons paginated (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of persons',
  })
  async findAllPersonsPaginated(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<PersonDto>> {
    return this.adminService.findAllPersonsPaginated(pagination);
  }

  @Get('/persons/:id')
  @ApiOperation({ summary: 'Get person by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Person found',
    type: PersonDto,
  })
  async findOnePerson(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PersonDto> {
    return this.adminService.findOnePerson(id);
  }

  @Patch('/persons/:id')
  @ApiOperation({ summary: 'Update person by ID (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Person updated successfully',
    type: PersonDto,
  })
  async updatePerson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
  ): Promise<PersonDto> {
    return this.adminService.updatePerson(id, dto);
  }

  @Delete('/persons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete person by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Person deleted' })
  async removePerson(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removePerson(id);
  }

  // ==================== COACHES ====================

  @Post('/coaches')
  @ApiOperation({ summary: 'Create a new coach (Admin)' })
  @ApiResponse({ status: 201, description: 'Coach created successfully' })
  async createCoach(@Body() dto: CreateCoachDto) {
    return this.adminService.createCoach(dto);
  }

  @Get('/coaches/paginated')
  @ApiOperation({ summary: 'List all coaches paginated (Admin)' })
  @ApiResponse({ status: 200, description: 'Paginated list of coaches' })
  async findAllCoachesPaginated(@Query() pagination: PaginationDto) {
    return this.adminService.findAllCoachesPaginated(pagination);
  }

  @Get('/coaches/:id')
  @ApiOperation({ summary: 'Get coach by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Coach found' })
  async findOneCoach(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOneCoach(id);
  }

  @Delete('/coaches/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete coach by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Coach deleted' })
  async removeCoach(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeCoach(id);
  }

  // ==================== ATHLETES ====================

  @Post('/athletes')
  @ApiOperation({ summary: 'Create a new athlete (Admin)' })
  @ApiResponse({ status: 201, description: 'Athlete created successfully' })
  async createAthlete(@Body() dto: CreateAthleteDto) {
    return this.adminService.createAthlete(dto);
  }

  @Get('/athletes/paginated')
  @ApiOperation({ summary: 'List all athletes paginated (Admin)' })
  @ApiResponse({ status: 200, description: 'Paginated list of athletes' })
  async findAllAthletesPaginated(@Query() pagination: PaginationDto) {
    return this.adminService.findAllAthletesPaginated(pagination);
  }

  @Get('/athletes/:id')
  @ApiOperation({ summary: 'Get athlete by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Athlete found' })
  async findOneAthlete(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOneAthlete(id);
  }

  @Delete('/athletes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete athlete by ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Athlete deleted' })
  async removeAthlete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.removeAthlete(id);
  }
}
