import { ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '@/config';
import type { JwtConfig } from '@/config/schemas/jwt.schema';

function mockExecutionContext(authHeader?: string): ExecutionContext {
	const request = {
		headers: {
			authorization: authHeader,
		},
		user: undefined as unknown,
	};

	return {
		switchToHttp: () => ({
			getRequest: () => request,
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	} as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
	beforeAll(() => {
		Logger.overrideLogger(false);
	});

	afterAll(() => {
		Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);
	});

	let guard: JwtAuthGuard;
	let reflector: Reflector;
	let config: AppConfigService;
	let jwtService: JwtService;

	const mockJwtConfig: JwtConfig = {
		secret: 'test-secret',
		expiresIn: 3600,
		refreshExpiresIn: 604800,
	};

	beforeEach(() => {
		reflector = new Reflector();
		config = {
			jwt: mockJwtConfig,
		} as AppConfigService;
		jwtService = {
			verifyAsync: jest.fn(),
		} as unknown as JwtService;

		guard = new JwtAuthGuard(reflector, config, jwtService);
	});

	describe('@Public() route', () => {
		it('should skip authentication and pass through', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

			const result = await guard.canActivate(mockExecutionContext());

			expect(result).toBe(true);
		});
	});

	describe('missing Authorization header', () => {
		it('should throw UnauthorizedException when no header present', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			await expect(guard.canActivate(mockExecutionContext())).rejects.toThrow(
				new UnauthorizedException('No token provided'),
			);
		});

		it('should throw UnauthorizedException when header does not start with "Bearer "', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			await expect(guard.canActivate(mockExecutionContext('Basic xyz'))).rejects.toThrow(
				new UnauthorizedException('No token provided'),
			);
		});
	});

	describe('valid token', () => {
		it('should set request.user and return true on successful verification', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
			const payload = { sub: 'user-1', email: 'a@b.com', roles: ['admin'] };
			(jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

			const ctx = mockExecutionContext('Bearer valid-token');
			const result = await guard.canActivate(ctx);

			expect(result).toBe(true);

			const request = ctx.switchToHttp().getRequest();
			expect(request.user).toEqual({
				userId: 'user-1',
				email: 'a@b.com',
				roles: ['admin'],
			});
		});

		it('should default roles to empty array when payload has no roles', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
			const payload = { sub: 'user-2', email: 'c@d.com' };
			(jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

			const ctx = mockExecutionContext('Bearer valid-token');
			await guard.canActivate(ctx);

			const request = ctx.switchToHttp().getRequest();
			expect(request.user.roles).toEqual([]);
		});
	});

	describe('invalid token', () => {
		it('should throw UnauthorizedException when verifyAsync rejects', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
			(jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('jwt expired'));

			await expect(guard.canActivate(mockExecutionContext('Bearer expired-token'))).rejects.toThrow(
				new UnauthorizedException('Invalid token'),
			);
		});
	});
});
