import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/user.dto';
import { IController, IControllerError } from 'src/common/interfaces/controller.interface';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('users')
export class UserController implements Omit<IController<User, RegisterDto>, 'create'> {

  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<User | IControllerError> {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    return plainToInstance(User, user);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto
  ): Promise<User | IControllerError>  {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    const updatedUser = await this.userService.update(id, {
      ...user,
      ...updateUserDto
    });

    return plainToInstance(User, updatedUser);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<void | IControllerError>  {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    await this.userService.delete(id);
    return { statusCode: 204, message: 'User was successfully deleted' };
  }

}
