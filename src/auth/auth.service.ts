import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import AuthErrors from './auth.errors';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(signInDto: SignInDto) {
    const { email, password: plainTextPassword } = signInDto;

    const existingUser = await this.userService.getUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedException(AuthErrors.InvalidUsernameOrPassword);
    }

    const { password: usersHashedPassword } = existingUser;
    const isPasswordCorrect = bcrypt.compareSync(
      plainTextPassword,
      usersHashedPassword,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(AuthErrors.InvalidUsernameOrPassword);
    }

    const accessToken = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        address: existingUser.address,
      },
      'cats',
    );

    return {
      name: existingUser.name,
      email: existingUser.email,
      address: existingUser.address,
      accessToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { name, email, address, password } = signUpDto;

    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException(AuthErrors.EmailAlreadyUsed);
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    return this.userService.createUser({
      name,
      email,
      address,
      password: hashedPassword,
    });
  }

  async isAuthenticated(token: string) {
    if (!token) {
      throw new UnauthorizedException(AuthErrors.Unauthorized);
    }

    const decoded: any = jwt.verify(token, 'cats');
    const user = await this.userService.getUserByEmail(decoded.email);

    if (!user) {
      throw new UnauthorizedException(AuthErrors.Unauthorized);
    }

    return true;
  }
}
