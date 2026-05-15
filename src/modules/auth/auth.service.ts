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

	private signTokens(userId: string, email: string, roles: string[]) {
		const payload = { sub: userId, email, roles };

		return {
			accessToken: this.jwtService.sign(payload),
			expiresIn: this.config.jwt.expiresIn,
		};
	}
}
