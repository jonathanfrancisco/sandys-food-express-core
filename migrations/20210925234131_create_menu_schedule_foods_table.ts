import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('menu_schedule_foods', (table) => {
    table.integer('menu_schedule_id');
    table
      .foreign('menu_schedule_id')
      .references('menu_schedule.id')
      .onDelete('CASCADE');
    table.integer('food_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('menu_schedule_foods');
}
