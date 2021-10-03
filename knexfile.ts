import Knex from 'knex';

interface IKnexConfig {
  [key: string]: Knex.Config;
}

const knexConfig: IKnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'admin',
      database: 'sandys_food_express',
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
