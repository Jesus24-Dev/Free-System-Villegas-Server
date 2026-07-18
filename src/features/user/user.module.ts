import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordService } from '../auth/services/password.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
