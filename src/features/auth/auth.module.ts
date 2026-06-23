import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoggerService } from 'src/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expireTime = configService.get<string>('JWT_EXPIRES_IN');

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            expiresIn: expireTime as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    RegisterUserUseCase,
    LoggerService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
