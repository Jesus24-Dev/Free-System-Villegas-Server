import { Injectable } from '@nestjs/common';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserInfoService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserInfoDto: CreateUserInfoDto) {
    createUserInfoDto.status = true;
    return this.prisma.user_info.create({
      data: createUserInfoDto,
    });
  }

  async findAll() {
    return this.prisma.user_info.findMany();
  }

  //TODO: Find by role (idk if i will do here or in User model)

  async findOne(id: string) {
    return this.prisma.user_info.findUnique({ where: { id } });
  }

  //TODO: Find by DNI and by User ID

  async update(id: string, updateUserInfoDto: UpdateUserInfoDto) {
    return this.prisma.user_info.update({
      where: { id },
      data: updateUserInfoDto,
    });
  }

  //TODO update only the status

  async remove(id: string) {
    return this.prisma.user_info.delete({ where: { id } });
  }
}
