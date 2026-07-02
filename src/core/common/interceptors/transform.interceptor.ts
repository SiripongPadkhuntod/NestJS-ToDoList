import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  status: string;
}

// หัวข้อ 3.1 Interceptor: ใช้จัดรูปแบบ Response ให้อยู่ในกรอบ { data: ... } เสมอ
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        status: 'success',
        data,
      })),
    );
  }
}
