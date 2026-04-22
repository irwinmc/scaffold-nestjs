import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from 'nestjs-pino';
import { AppConfigService } from '@/config';

/**
 * 错误响应接口
 */
export interface ErrorResponse {
	statusCode: number;
	message: string;
	error: string;
	timestamp: string;
	path: string;
	method: string;
	stack?: string;
}

/**
 * 全局异常过滤器
 */
@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly logger: Logger,
		private readonly config: AppConfigService,
	) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<FastifyRequest>();
		const reply = ctx.getResponse<FastifyReply>();

		const errorInfo = this.getErrorInfo(exception);
		const errorResponse = this.buildErrorResponse(errorInfo, request);

		// 使用 Pino 记录结构化日志
		this.logErrorWithPino(errorInfo, request, exception);

		// 发送响应
		reply.status(errorInfo.statusCode).send(errorResponse);
	}

	/**
	 * 获取错误信息
	 */
	private getErrorInfo(exception: unknown): {
		statusCode: number;
		message: string;
		error: string;
		stack?: string;
	} {
		// HttpException 处理
		if (exception instanceof HttpException) {
			const statusCode = exception.getStatus();
			const response = exception.getResponse();

			let message = 'Http Exception';

			// 处理 Zod 验证错误
			if (response && typeof response === 'object') {
				// 检查是否是 Zod 验证错误格式 (nestjs-zod 的格式)
				if ('errors' in response && Array.isArray(response.errors)) {
					// 提取所有 Zod 错误消息
					const zodMessages = (
						response.errors as Array<{ path?: (string | number)[]; message?: string }>
					).map(error => {
						const path = error.path && error.path.length > 0 ? `${error.path.join('.')}: ` : '';
						return `${path}${error.message || 'Validation error'}`;
					});
					message = zodMessages.join('; ');
				}
				// 处理标准的 message 字段
				else if ('message' in response) {
					const messageValue = response.message;
					message = Array.isArray(messageValue) ? messageValue.join(', ') : String(messageValue);
				}
			} else if (typeof response === 'string') {
				message = response;
			}

			return {
				statusCode,
				message,
				error: exception.name,
				stack: exception.stack,
			};
		}

		// 标准错误处理
		if (exception instanceof Error) {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: exception.message,
				error: exception.name,
				stack: exception.stack,
			};
		}

		// 字符串错误处理
		if (typeof exception === 'string') {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: exception,
				error: 'StringError',
			};
		}

		// 默认错误处理
		return {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Internal server error',
			error: 'UnknownError',
		};
	}

	/**
	 * 构建错误响应
	 */
	private buildErrorResponse(
		errorInfo: { statusCode: number; message: string; error: string; stack?: string },
		request: FastifyRequest,
	): ErrorResponse {
		const response: ErrorResponse = {
			statusCode: errorInfo.statusCode,
			message: errorInfo.message,
			error: errorInfo.error,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
		};

		// 仅开发环境返回堆栈信息
		if (this.isDevelopment() && errorInfo.stack) {
			response.stack = errorInfo.stack;
		}

		return response;
	}

	/**
	 * 使用 Pino 记录结构化错误日志
	 */
	private logErrorWithPino(
		errorInfo: { statusCode: number; message: string; error: string; stack?: string },
		request: FastifyRequest,
		originalException: unknown,
	): void {
		// 构建结构化日志数据
		const logData = {
			statusCode: errorInfo.statusCode,
			errorType: errorInfo.error,
			message: errorInfo.message,
			req: {
				method: request.method,
				url: request.url,
				query: request.query,
				params: request.params,
				headers: this.sanitizeHeaders(request.headers),
			},
			service: 'ops-server',
			timestamp: new Date().toISOString(),
		};

		if (errorInfo.statusCode >= 500) {
			this.logger.error(logData, `Server Error: ${errorInfo.message}`);

			if (this.isDevelopment() && originalException instanceof Error) {
				this.logger.debug(
					{
						exception: {
							name: originalException.name,
							message: originalException.message,
							stack: originalException.stack,
						},
					},
					'Exception details',
				);
			}
		} else if (errorInfo.statusCode >= 400) {
			this.logger.warn(logData, `Client Error: ${errorInfo.message}`);
		} else {
			this.logger.log(logData, `Request Error: ${errorInfo.message}`);
		}
	}

	/**
	 * 清理敏感头部信息
	 */
	private sanitizeHeaders(headers: FastifyRequest['headers']): Record<string, string | undefined> {
		const sanitized: Record<string, string | undefined> = {};
		const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

		for (const [key, value] of Object.entries(headers)) {
			if (sensitiveHeaders.includes(key.toLowerCase())) {
				sanitized[key] = '[FILTERED]';
			} else if (typeof value === 'string') {
				sanitized[key] = value;
			} else {
				sanitized[key] = String(value);
			}
		}

		return sanitized;
	}

	/**
	 * 检查是否为开发环境
	 */
	private isDevelopment(): boolean {
		return this.config.app.nodeEnv !== 'production';
	}
}
