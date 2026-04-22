import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface RequestUser {
	userId: string;
	email: string;
	roles: string[];
}

export const CurrentUser = createParamDecorator<keyof RequestUser | undefined>((data, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const user = request.user as RequestUser | undefined;

	if (!user) {
		throw new UnauthorizedException('User not authenticated');
	}

	return data ? user[data] : user;
});
