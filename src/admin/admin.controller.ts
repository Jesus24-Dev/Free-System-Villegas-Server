import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GymResponseDto, UserResponseDto } from './dto/response';

@Controller('admin')
@Public()
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
  async changeUserStatus(@Param('id') id: string): Promise<void> {
    await this.adminService.changeUserStatus(id);
  }
}
