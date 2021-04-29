import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';

import { User } from './user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
