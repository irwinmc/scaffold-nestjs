import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '@/config';

@Injectable()
export class JwtAuthGuard {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		private reflector: Reflector,
		private config: AppConfigService,
		private jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('No token provided');
		}

		const token = authHeader.substring(7);

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.config.jwt.secret,
			});

			request.user = {
				userId: payload.sub,
				email: payload.email,
			};

			return true;
		} catch (error) {
			this.logger.error(`Token verification failed: ${error.message}`);
			this.logger.error(`Server time: ${new Date().toISOString()}, ExpiresIn: ${this.config.jwt.expiresIn}s`);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
