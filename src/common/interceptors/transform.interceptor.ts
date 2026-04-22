import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { FastifyReply } from 'fastify';

export interface Response<T> {
	data: T;
	statusCode: number;
	message: string;
	timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
		const response = context.switchToHttp().getResponse<FastifyReply>();

		return next.handle().pipe(
			map((data: T) => ({
				data,
				statusCode: response.statusCode,
				message: 'Success',
				timestamp: new Date().toISOString(),
			})),
		);
	}
}
