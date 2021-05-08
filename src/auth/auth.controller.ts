import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { AuthService } from './auth.service';
import { JoiValidationPipe } from 'pipes/joi-validation.pipe';
import SignUpSchema from './schemas/sign-up.schema';

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
  @UsePipes(new JoiValidationPipe(SignUpSchema))
  async signUp(@Body() signUpDto: SignUpDto) {
    return {
      data: await this.authService.signUp(signUpDto),
    };
  }
}
