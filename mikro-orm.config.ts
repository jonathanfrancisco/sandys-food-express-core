import { Options } from '@mikro-orm/core';

const config = {
  autoLoadEntities: true,
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  dbName: 'sandys_food_express',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
} as Options;

export default config;
