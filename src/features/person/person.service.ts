import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Person } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreatePersonDto, UpdatePersonDto } from './dto/request';
import { PersonFoundedResponseDto } from './dto/response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data: createPersonDto });
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponseDto<Person>> {
    const { skip, limit, page } = pagination;
    const where = { deleted_at: null };
    const [data, total] = await Promise.all([
      this.prisma.person.findMany({ where, skip, take: limit }),
      this.prisma.person.count({ where }),
    ]);
    return new PaginatedResponseDto(data, total, page!, limit!);
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.prisma.person.findFirst({
      where: { id, deleted_at: null },
    });
    if (!person) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
    return person;
  }

  async checkIfPersonByDnyExists(
    dni: string,
  ): Promise<PersonFoundedResponseDto | null> {
    const person = await this.prisma.person.findFirst({
      where: { dni, deleted_at: null },
      include: {
        user: true,
      },
    });

    if (!person) {
      return null;
    }

    if (person.user) {
      throw new ConflictException(
        `Ya hay un usuario registrado con la cedula ${dni}`,
      );
    }

    return {
      id: person.id,
      name: person.name,
      surname: person.surname,
      role: 'ATHLETE',
    };
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.person.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
