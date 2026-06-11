import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordService } from './dto/services/password.service';
import { TokenService } from './dto/services/token.service';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';

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
  providers: [AuthService, PasswordService, TokenService, RegisterUserUseCase],
  exports: [AuthService],
})
export class AuthModule {}
