import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { IWeatherResponse } from './interfaces/weather-response.interface';
import { FAILED_TO_FETCH } from 'src/common/constants/response.contants';
import { API_URL } from 'src/common/constants/routes.constants';

@Injectable()
export class WeatherService {

  constructor(private readonly httpService: HttpService) {  }

  private readonly logger = new Logger(WeatherService.name);

  getWeatherInCity(cityName: string, apiKey: string): Observable<IWeatherResponse> {
    const url = API_URL;

    const params = {
      access_key: apiKey,
      query: cityName,
    };

    return this.httpService.get(url, { params }).pipe(
      retry(3),
      map(response => response.data),
      catchError(err => {
        this.logger.error(FAILED_TO_FETCH, err.message)
        return throwError(() => new Error(FAILED_TO_FETCH))
      })
    )

  }
}
