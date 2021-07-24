import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { MenuSchedule } from './menu-schedule.entity';

@Entity()
export class Food {
  constructor(name: string, price: number, picture: string, ownerId: number) {
    this.name = name;
    this.price = price;
    this.picture = picture;
    this.ownerId = ownerId;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ columnType: 'decimal' })
  price!: number;

  @Property()
  picture!: string;

  @Property()
  ownerId!: number;

  @ManyToMany(() => MenuSchedule, (menuSchedule) => menuSchedule.foods)
  menuSchedules = new Collection<MenuSchedule>(this);

  @Property({ nullable: true })
  createdAt: Date = new Date();

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
