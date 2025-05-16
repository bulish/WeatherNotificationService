import {
  Injectable,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GlobalCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    
    const cacheKey = `CACHE::${request.method}::${request.originalUrl}`;
    
    return cacheKey;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const result$ = await super.intercept(context, next);

    return result$.pipe(
      tap(() => {
        console.log('Console hit/miss resolved, continuing...');
      })
    );
  }
}
