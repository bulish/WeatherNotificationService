import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class WeatherApiKeyInterceptor implements NestInterceptor {
  
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    const apiKey = this.configService.get<string>('API_KEY');

    request.apiKey = apiKey;

    return next.handle();
  }

}
