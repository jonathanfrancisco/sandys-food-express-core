import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [MikroOrmModule.forRoot(), AuthModule, UserModule, OrderModule],
})
export class AppModule {}
