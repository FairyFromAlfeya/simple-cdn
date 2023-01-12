import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ProfilingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ProfilingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const old = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${context.getHandler().name}() call took ${Date.now() - old}ms`,
          ),
        ),
      );
  }
}
