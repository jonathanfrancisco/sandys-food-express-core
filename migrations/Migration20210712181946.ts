import { Migration } from '@mikro-orm/migrations';

export class Migration20210712181946 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "menu_schedule" ("id" serial primary key, "scheduled_at" timestamptz(0) not null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null);');

    this.addSql('create table "menu_schedule_foods" ("menu_schedule_id" int4 not null, "food_id" int4 not null);');
    this.addSql('alter table "menu_schedule_foods" add constraint "menu_schedule_foods_pkey" primary key ("menu_schedule_id", "food_id");');

    this.addSql('alter table "menu_schedule_foods" add constraint "menu_schedule_foods_menu_schedule_id_foreign" foreign key ("menu_schedule_id") references "menu_schedule" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "menu_schedule_foods" add constraint "menu_schedule_foods_food_id_foreign" foreign key ("food_id") references "food" ("id") on update cascade on delete cascade;');
  }

}
