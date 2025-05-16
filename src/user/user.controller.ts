import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/user.dto';
import { IController, IControllerError } from 'src/common/interfaces/controller.interface';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { USERS_LIST } from 'src/common/constants/cache.constants';
import { Cache } from 'cache-manager';
import { USER_DELETE_SUCCESS, USER_NOT_FOUND } from 'src/common/constants/response.contants';

@Controller('users')
export class UserController implements Omit<IController<User, RegisterDto>, 'create'> {

  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get()
  @CacheTTL(60)
  @CacheKey(USERS_LIST)
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
      return { statusCode: 404, message: USER_NOT_FOUND };
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
      return { statusCode: 404, message: USER_NOT_FOUND };
    }

    const updatedUser = await this.userService.update(id, {
      ...user,
      ...updateUserDto
    });

    await this.cacheManager.del(USERS_LIST);
    return plainToInstance(User, updatedUser);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<void | IControllerError>  {
    const user = await this.userService.getById(id);

    if (!user) {
      return { statusCode: 404, message: USER_NOT_FOUND };
    }

    await this.userService.delete(id);
    await this.cacheManager.del(USERS_LIST);
    return { statusCode: 204, message: USER_DELETE_SUCCESS };
  }

}
