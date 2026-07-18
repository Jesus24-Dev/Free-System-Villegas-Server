import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/request';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PasswordService } from '../auth/services/password.service';

export type UserWithPerson = Prisma.UserGetPayload<{
  include: { person: true };
}>;
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );
    return this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<User>> {
    const { skip, limit, page } = pagination;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where: { deleted_at: null } }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, deleted_at: null },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async getProfile(id: string): Promise<UserWithPerson> {
    const user = await this.prisma.user.findFirst({
      where: { id, deleted_at: null },
      include: { person: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email, deleted_at: null },
    });
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
    await this.prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
