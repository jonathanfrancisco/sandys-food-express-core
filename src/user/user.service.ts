import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { User } from './user.entity';
import { CreateUserRequestDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      email,
    });

    return user;
  }

  async createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
    const { name, email, address, password } = createUserRequestDto;

    const user = new User(name, email, address, password);

    await this.userRepository.persistAndFlush(user);

    return user;
  }
}
