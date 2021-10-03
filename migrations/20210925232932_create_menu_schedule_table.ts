import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('menu_schedule', (table) => {
    table.increments('id').primary();
    table.timestamp('scheduled_at').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('menu_schedule');
}
