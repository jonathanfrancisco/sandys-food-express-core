import Knex from 'knex';
import { nextTick } from 'process';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('menu_schedule_foods', (table) => {
    table.foreign('food_id').references('food.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  
  return knex.schema.alterTable('menu_schedule_foods', (table) => {
    table.dropForeign(['food_id']);
  });
}
