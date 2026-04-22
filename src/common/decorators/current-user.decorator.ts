import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
	userId: string;
	email: string;
	roles: string[];
}

export const CurrentUser = createParamDecorator((data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const user = request.user as RequestUser | undefined;

	if (data) {
		return user?.[data];
	}

	return user;
});
