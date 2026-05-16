import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '@/modules/database';
import { users } from '@/modules/database/schemas';
import { AppConfigService } from '@/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly db: DatabaseService,
		private readonly jwtService: JwtService,
		private readonly config: AppConfigService,
	) {}

	async register(dto: RegisterDto) {
		const existing = await this.db.query.select().from(users).where(eq(users.email, dto.email)).limit(1);

		if (existing.length > 0) {
			throw new ConflictException('Email already registered');
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const [user] = await this.db.query
			.insert(users)
			.values({
				email: dto.email,
				username: dto.username,
				password: hashedPassword,
			})
			.returning({ id: users.id, email: users.email, username: users.username });

		const tokens = this.signTokens(user.id, user.email, []);
		return { user, ...tokens };
	}

	async login(dto: LoginDto) {
		const rows = await this.db.query.select().from(users).where(eq(users.email, dto.email)).limit(1);

		const user = rows[0];

		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const isMatch = await bcrypt.compare(dto.password, user.password);

		if (!isMatch) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const tokens = this.signTokens(user.id, user.email, []);
		return {
			user: { id: user.id, email: user.email, username: user.username },
			...tokens,
		};
	}

	async refresh(refreshToken: string) {
		try {
			const payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.config.jwt.secret,
			});

			const tokens = this.signTokens(payload.sub, payload.email, payload.roles ?? []);
			return tokens;
		} catch {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	async getProfile(userId: string) {
		const rows = await this.db.query
			.select({
				id: users.id,
				email: users.email,
				username: users.username,
				createdAt: users.createdAt,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		const user = rows[0];

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		return user;
	}

	private signTokens(userId: string, email: string, roles: string[]) {
		const payload = { sub: userId, email, roles };

		return {
			accessToken: this.jwtService.sign(payload),
			refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
			expiresIn: this.config.jwt.expiresIn,
		};
	}
}
