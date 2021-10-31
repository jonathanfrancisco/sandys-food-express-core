import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { SignUpRequestDto } from './dto/request/sign-up.request.dto';

import { AuthService } from './auth.service';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import AuthSchema from './auth.schema';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(AuthSchema.signIn))
  async login(@Body() signInDto: SignInRequestDto) {
    return {
      data: await this.authService.login(signInDto),
    };
  }

  @Post('/sign-up')
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(AuthSchema.signUp))
  async signUp(@Body() signUpDto: SignUpRequestDto) {
    return {
      data: await this.authService.signUp(signUpDto),
    };
  }
}
