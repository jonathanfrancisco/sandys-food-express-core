import { Model } from 'objection';
import * as knex from 'knex';
import knexfile from '../../../../knexfile';
import MenuSchedule from './menu-schedule.model';

const knexInstance = knex(knexfile.development);
Model.knex(knexInstance);

export default class Food extends Model {
  id!: number;
  name!: string;
  picture!: string;
  price!: number;
  menuSchedules: MenuSchedule[];
  owner_id: number;
  created_at!: string;
  updated_at?: string;

  static tableName = 'food';

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static relationMappings() {
    return {
      menuSchedules: {
        relation: Model.ManyToManyRelation,
        modelClass: MenuSchedule,
        join: {
          from: 'food.id',
          through: {
            from: 'menu_schedule_foods.food_id',
            to: 'menu_schedule_foods.menu_schedule_id',
          },
          to: 'menu_schedule.id',
        },
      },
    };
  }
}
