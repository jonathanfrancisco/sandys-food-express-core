import { Migration } from '@mikro-orm/migrations';

export class Migration20210508153413 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "address" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null);',
    );
  }
}
