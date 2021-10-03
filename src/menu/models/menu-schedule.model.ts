import { Model } from 'objection';
import * as knex from 'knex';
import knexfile from '../../../knexfile';
import Food from './food.model';

const knexInstance = knex(knexfile.development);
Model.knex(knexInstance);

export default class MenuSchedule extends Model {
  id!: number;
  scheduled_at!: string;
  foods: Food[];
  created_at!: string;
  updated_at?: string;

  static tableName = 'menu_schedule';

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static relationMappings() {
    return {
      foods: {
        relation: Model.ManyToManyRelation,
        modelClass: Food,
        join: {
          from: 'menu_schedule.id',
          through: {
            from: 'menu_schedule_foods.menu_schedule_id',
            to: 'menu_schedule_foods.food_id',
          },
          to: 'food.id',
        },
      },
    };
  }
}
