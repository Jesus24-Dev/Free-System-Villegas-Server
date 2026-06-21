import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
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
