import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
