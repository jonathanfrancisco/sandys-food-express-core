import Knex from 'knex';

import {config} from 'dotenv';
config({ path: '.env' })


interface IKnexConfig {
  [key: string]: Knex.Config;
}

const knexConfig: IKnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
  },
};


export default knexConfig;
