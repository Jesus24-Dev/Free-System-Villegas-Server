import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserInfoModule } from './user-info/user-info.module';
import { WeightsModule } from './weights/weights.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [PrismaModule, UserModule, UserInfoModule, WeightsModule, PersonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
