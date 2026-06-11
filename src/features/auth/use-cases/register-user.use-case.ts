import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import { PasswordService } from '../dto/services/password.service';
import { RegisterDto } from '../dto/register-auth.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.passwordService.hash(dto.password);
      const person = await tx.person.create({
        data: {
          dni: dto.dni,
          name: dto.name,
          surname: dto.surname,
          birthday: dto.birthday,
          gender: dto.gender,
        },
      });
      if (dto.role === 'ATHLETE') {
        await tx.athlete.create({
          data: {
            person_id: person.id,
          },
        });
      } else {
        await tx.coach.create({
          data: {
            person_id: person.id,
          },
        });
      }
      const user = tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: [dto.role],
          person_id: person.id,
        },
      });
      return user;
    });
  }
}
