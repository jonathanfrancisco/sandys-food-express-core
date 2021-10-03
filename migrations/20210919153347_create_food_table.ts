import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('food', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('picture', 1000).notNullable();
    table.decimal('price');
    table.integer('owner_id').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('food');
}
