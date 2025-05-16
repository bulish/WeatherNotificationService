import { Controller, Get, Param, Req, UseInterceptors } from "@nestjs/common";
import { WeatherApiKeyInterceptor } from "src/common/interceptors/weather-api-key.interceptor";
import { WeatherService } from "./weather.service";
import { IWeatherResponse } from "./interfaces/weather-response.interface";
import { Observable } from "rxjs";

@Controller('weather')
export class WeatherController {

  constructor(private readonly weatherService: WeatherService) { }

  @Get('current-weather/:city')
  @UseInterceptors(WeatherApiKeyInterceptor)
  getCurrentWeatherInCity(
    @Param('city') city: string,
    @Req() req: Request & { apiKey: string  }
  ): Observable<IWeatherResponse> {
    return this.weatherService.getWeatherInCity(city, req.apiKey);
  }

}
