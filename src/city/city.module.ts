import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entity/city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CityRepository } from './repository/city.repository';

@Module({
  imports: [TypeOrmModule.forFeature([City]), AuthModule],
  providers: [CityService, CityRepository],
  controllers: [CityController]
})
export class CityModule { }
