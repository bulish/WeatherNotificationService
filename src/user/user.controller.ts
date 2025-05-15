import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ) {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    return plainToInstance(User, user);
  }

  @Put(':id')
  async updateUser(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto
  ) {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    const updatedUser = await this.userService.updateUser(id, {
      ...user,
      ...updateUserDto
    });

    return plainToInstance(User, updatedUser);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ) {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: 'User not found' };
    }

    await this.userService.deleteUser(id);
    return HttpStatus.NO_CONTENT;
  }

}
