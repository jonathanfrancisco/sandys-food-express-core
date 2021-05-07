import { Migration } from '@mikro-orm/migrations';

export class Migration20210411153406 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "password" varchar(255) not null;',
    );
  }
}
