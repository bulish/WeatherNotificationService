import { IsString, IsNotEmpty, MinLength, IsEmail  } from 'class-validator';

export class LoginDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

}
