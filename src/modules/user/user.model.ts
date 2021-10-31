import { Model } from 'objection';
import * as knex from 'knex';
import knexfile from '../../../knexfile';

const knexInstance = knex(knexfile.development);
Model.knex(knexInstance);

export default class User extends Model {
  id!: number;
  name!: string;
  email!: string;
  price!: number;
  address!: string;
  password!: string;
  created_at!: string;
  updated_at?: string;

  static tableName = 'user';

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}
