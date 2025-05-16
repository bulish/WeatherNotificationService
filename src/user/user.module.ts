import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController]
})
export class UserModule { }
