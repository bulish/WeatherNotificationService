import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entity/city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CityRepository } from './repository/city.repository';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([City]),
    AuthModule,
    CacheModule.register()
  ],
  providers: [CityService, CityRepository],
  controllers: [CityController]
})
export class CityModule { }
