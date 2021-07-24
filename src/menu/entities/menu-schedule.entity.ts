import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Food } from './food.entity';

@Entity()
export class MenuSchedule {
  constructor(scheduledAt: Date) {
    this.scheduledAt = scheduledAt;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  scheduledAt!: Date;

  @ManyToMany(() => Food, 'menuSchedules', { owner: true })
  foods = new Collection<Food>(this);

  @Property({ nullable: true })
  createdAt: Date = new Date();

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
