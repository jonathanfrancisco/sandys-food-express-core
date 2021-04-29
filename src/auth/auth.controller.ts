import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return {
      data: await this.authService.login(loginDto),
    };
  }

  @Post('/sign-up')
  @HttpCode(201)
  async signUp(@Body() signUpDto: SignUpDto) {
    return {
      data: await this.authService.signUp(signUpDto),
    };
  }
}
