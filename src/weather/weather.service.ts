import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, Observable, retry, throwError } from 'rxjs';
import { IWeatherResponse } from './interfaces/weather-response.interface';
import { FAILED_TO_FETCH } from 'src/common/constants/response.contants';
import { API_URL } from 'src/common/constants/routes.constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {  }

  private readonly logger = new Logger(WeatherService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleWeatherCheck() {
    this.logger.debug('Cron job: Kontrola počasí spuštěna');

    const apiKey = this.configService.get<string>('API_KEY');

    try {
      const weatherData = await firstValueFrom(this.getWeatherInCity('Prague', apiKey as string));

      const shouldNotify = this._evaluateNotificationRules(weatherData);

      if (shouldNotify) {
        await this._sendNotifications();
      } else {
        this.logger.debug('Notifikace se neposílají - podmínky nesplněny');
      }
    } catch (error) {
      this.logger.error('Chyba při kontrole počasí', error);
    }
  }

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

  private _evaluateNotificationRules(data: IWeatherResponse): boolean {
    if (!data?.current) {
      this.logger.warn('Data o počasí nemají očekávanou strukturu');
      return false;
    }

    const weatherDescriptions: string[] = data.current.weather_descriptions || [];
    const temperature: number = data.current.temperature;

    const isRaining = weatherDescriptions.some(desc => desc.toLowerCase().includes('rain'));

    this.logger.debug(`Weather - Rainy: ${isRaining}, Temperature: ${temperature}`);

    return isRaining;
  }

  private async _sendNotifications(): Promise<void> {
    // TODO: Implementovat odesílání notifikací (email, push)
    this.logger.log('Notifikace by teď byly odeslány uživatelům...');
  }
}
