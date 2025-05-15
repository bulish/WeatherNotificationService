import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

}
