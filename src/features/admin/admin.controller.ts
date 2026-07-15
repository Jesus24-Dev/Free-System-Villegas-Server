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
}
