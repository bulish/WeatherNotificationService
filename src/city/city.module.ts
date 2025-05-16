import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entity/city.entity';
import { CityService } from './city.service';
import { CityRepository } from './repository/city.repository';
import { CityController } from './city.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CityService, CityRepository],
  controllers: [CityController]
})
export class CityModule { }
