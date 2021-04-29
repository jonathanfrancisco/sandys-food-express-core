import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto) {
    const { email, password: plainTextPassword } = loginDto;

    const existingUser = await this.userService.getUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedException({
        error: {
          code: 'INVALID_USERNAME_OR_PASSWORD',
          message: 'Invalid username or password. Please try again',
        },
      });
    }

    const { password: usersHashedPassword } = existingUser;
    const isPasswordCorrect = bcrypt.compareSync(
      plainTextPassword,
      usersHashedPassword,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        error: {
          code: 'INVALID_USERNAME_OR_PASSWORD',
          message: 'Invalid username or password. Please try again',
        },
      });
    }

    const accessToken = jwt.sign(
      {
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
      throw new BadRequestException({
        error: {
          code: 'USER_EMAIL_ALREADY_EXISTS',
          message: 'Email address has already been taken by another user',
        },
      });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    return this.userService.createUser({
      name,
      email: 'email',
      address,
      password: hashedPassword,
    });
  }

  async isAuthenticated(authHeaders: any) {
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, 'cats');

      const user = this.userService.getUserByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException({
          error: {
            code: 'UNAUTHORIZED',
            message: `You're not authorized to access this endpoint`,
          },
        });
      }

      return decoded;
    } else {
      throw new UnauthorizedException({
        error: {
          code: 'UNAUTHORIZED',
          message: `You're not authorized to access this endpoint`,
        },
      });
    }
  }
}
