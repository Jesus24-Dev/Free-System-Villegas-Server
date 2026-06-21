import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PasswordService } from '../services/password.service';
import { RegisterDto } from '../dto/request';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly logger: LoggerService,
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
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: [dto.role],
          person_id: person.id,
        },
      });

      this.logger.info('USER_REGISTERED', {
        userId: user.id,
        role: user.role,
      });

      return user;
    });
  }
}
