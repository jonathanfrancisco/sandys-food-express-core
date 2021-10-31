import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import User from './user.model';

@Injectable()
export class UserService {
  async getUserByEmail(email: string): Promise<User> {
    const user = User.query().findOne({
      email,
    });

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, address, password } = createUserDto;

    const user = User.query().insert({
      name,
      email,
      address,
      password,
    });

    return user;
  }
}
