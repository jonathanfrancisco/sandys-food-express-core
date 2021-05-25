import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';

import { Food } from './entities/food.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
            region: configService.get('AWS_REGION'),
          },
        };
      },
    }),
    MikroOrmModule.forFeature([Food]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [],
})
export class MenuModule {}
