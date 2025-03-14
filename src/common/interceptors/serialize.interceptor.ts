import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { ClassConstructor } from 'typings/classConstructor';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: ClassConstructor) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
