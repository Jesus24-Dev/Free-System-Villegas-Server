import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from 'src/generated/prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/request';

export type UserWithPerson = Prisma.UserGetPayload<{
  include: { person: true };
}>;
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async getProfile(id: string): Promise<UserWithPerson> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { person: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
