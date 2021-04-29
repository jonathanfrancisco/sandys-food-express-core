import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  constructor(name: string, email: string, address: string, password: string) {
    this.name = name;
    this.email = email;
    this.address = address;
    this.password = password;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  address!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ nullable: true })
  createdAt: Date = new Date();

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
