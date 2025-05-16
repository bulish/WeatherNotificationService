import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { IWeatherResponse } from './interfaces/weather-response.interface';

@Injectable()
export class WeatherService {

  constructor(private readonly httpService: HttpService) {  }

  private readonly logger = new Logger(WeatherService.name);

  getWeatherInCity(cityName: string, apiKey: string): Observable<IWeatherResponse> {
    const url = 'http://api.weatherstack.com/current';

    const params = {
      access_key: apiKey,
      query: cityName,
    };

    return this.httpService.get(url, { params }).pipe(
      retry(3),
      map(response => response.data),
      catchError(err => {
        this.logger.error('Failed to fetch data ', err.message)
        return throwError(() => new Error('Failed to fetch weather'))
      })
    )

  }
}
