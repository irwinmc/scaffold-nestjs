import { RolesGuard } from '@/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { RequestUser } from '@/common/decorators/current-user.decorator';

function mockExecutionContext(user?: RequestUser): ExecutionContext {
	const request = { user };

	return {
		switchToHttp: () => ({
			getRequest: () => request,
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	} as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
	let guard: RolesGuard;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		guard = new RolesGuard(reflector);
	});

	describe('no roles required', () => {
		it('should pass when @Roles() decorator is absent', () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

			expect(guard.canActivate(mockExecutionContext())).toBe(true);
		});

		it('should pass when @Roles() receives empty array', () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

			expect(guard.canActivate(mockExecutionContext())).toBe(true);
		});
	});

	describe('unauthenticated user', () => {
		it('should throw ForbiddenException when request.user is undefined', () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

			expect(() => guard.canActivate(mockExecutionContext(undefined))).toThrow(
				new ForbiddenException('Access denied'),
			);
		});
	});

	describe('role matching', () => {
		const user: RequestUser = { userId: '1', email: 'a@b.com', roles: ['editor'] };

		it('should throw ForbiddenException when user role is not in requiredRoles', () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

			expect(() => guard.canActivate(mockExecutionContext(user))).toThrow(
				new ForbiddenException('Insufficient permissions'),
			);
		});

		it('should pass when user has the required single role', () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['editor']);

			expect(guard.canActivate(mockExecutionContext(user))).toBe(true);
		});

		it('should pass when user matches any of multiple required roles', () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'editor']);

			expect(guard.canActivate(mockExecutionContext(user))).toBe(true);
		});
	});
});
