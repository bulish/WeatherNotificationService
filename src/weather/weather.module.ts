import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, AuthModule, ScheduleModule.forRoot()],
  providers: [WeatherService],
  controllers: [WeatherController]
})
export class WeatherModule { }
