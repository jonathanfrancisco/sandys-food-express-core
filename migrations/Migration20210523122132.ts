import { Migration } from '@mikro-orm/migrations';

export class Migration20210523122132 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "food" ("id" serial primary key, "name" varchar(255) not null, "price" decimal not null, "picture" varchar(255) not null, "owner_id" int4 not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null);');
  }

}
