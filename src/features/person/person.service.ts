import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Person } from 'src/generated/prisma/client';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data: createPersonDto });
  }

  async findAll() {
    return this.prisma.person.findMany();
  }

  async findOne(id: string) {
    return this.prisma.person.findUnique({ where: { id } });
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  remove(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }
}
