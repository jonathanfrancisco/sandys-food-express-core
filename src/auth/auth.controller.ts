import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { AuthService } from './auth.service';
import { JoiValidationPipe } from 'pipes/joi-validation.pipe';
import AuthSchema from './auth.schema';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(AuthSchema.signIn))
  async login(@Body() signInDto: SignInDto) {
    return {
      data: await this.authService.login(signInDto),
    };
  }

  @Post('/sign-up')
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(AuthSchema.signUp))
  async signUp(@Body() signUpDto: SignUpDto) {
    return {
      data: await this.authService.signUp(signUpDto),
    };
  }
}
