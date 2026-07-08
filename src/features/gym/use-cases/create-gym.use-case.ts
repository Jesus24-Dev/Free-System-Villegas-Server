import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGymDto } from '../dto/request';
import { RawGymDto } from '../dto/response';
import { LoggerService } from 'src/common/logger/logger.service';
@Injectable()
export class CreateGymUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async execute(userId: string, createGym: CreateGymDto): Promise<RawGymDto> {
    return this.prisma.$transaction(async (tx) => {
      const coach = await tx.coach.findFirst({
        where: {
          person: {
            user: {
              id: userId,
            },
          },
          deleted_at: null,
        },
      });
      if (!coach) {
        this.logger.error('GYM_CREATION_FAILED', new Error('Coach not found'), {
          userId,
        });

        throw new ForbiddenException(
          'Solo los entrenadores pueden crear gimnasios',
        );
      }

      if (
        !createGym.payment_methods ||
        createGym.payment_methods.length === 0
      ) {
        this.logger.error(
          'GYM_CREATION_FAILED',
          new Error('Payments methods not found'),
          {
            payload: createGym,
          },
        );

        throw new BadRequestException(
          'El gimnasio debe tener al menos un método de pago móvil',
        );
      }

      const gym = await tx.gym.create({
        data: {
          owner_id: coach.id,
          ...createGym,
        },
      });

      const payments = createGym.payment_methods.map((pay) => ({
        bank_to_pay: pay.bank_to_pay,
        dni: pay.dni,
        phone: pay.phone,
        gym_id: gym.id,
      }));

      await tx.pagoMovilFields.createMany({ data: payments });

      this.logger.info('GYM_CREATED', {
        gymId: gym.id,
        ownerId: coach.id,
      });
      return gym;
    });
  }
}
