import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Person } from 'src/generated/prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreatePersonDto, UpdatePersonDto } from './dto/request';
import { PersonFoundedResponseDto } from './dto/response';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data: createPersonDto });
  }

  async findAll(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.prisma.person.findUnique({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
    return person;
  }

  async findPersonByDni(dni: string): Promise<PersonFoundedResponseDto | null> {
    const person = await this.prisma.person.findUnique({
      where: { dni },
      include: {
        user: true,
      },
    });

    if (!person) {
      return null;
    }

    return {
      id: person.id,
      name: person.name,
      surname: person.surname,
      role: person.user?.role ? person.user?.role : [],
    };
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.person.delete({ where: { id } });
  }
}
