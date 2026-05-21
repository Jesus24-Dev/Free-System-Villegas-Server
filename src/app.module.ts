import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserInfoModule } from './user-info/user-info.module';
import { WeightsModule } from './weights/weights.module';

@Module({
  imports: [PrismaModule, UserModule, UserInfoModule, WeightsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
