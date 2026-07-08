import { Controller, Get, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GymResponseDto, UserResponseDto } from './dto/response';
import { JwtPayload } from 'src/features/auth/dto/request';
import { GetUser } from 'src/features/auth/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

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
  async changeUserStatus(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminService.changeUserStatus(id);
  }

  @Get('')
  test(@GetUser() user: JwtPayload) {
    return user;
  }
}
