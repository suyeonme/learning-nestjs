import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// Interceptor: Entity Instance => DTO Instance => JSON

/**
 * @Decorator SerializeInterceptor
 */
export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data: any) => {
        // convert entity to a plain javascript object
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // exclude any properties that are not defined in the DTO
        });
      }),
    );
  }
}
