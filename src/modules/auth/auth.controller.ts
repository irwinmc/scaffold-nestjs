import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public, CurrentUser, type RequestUser } from '@/common/decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@Public()
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	@ApiResponse({ status: 409, description: 'Email already registered' })
	register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Login with email and password' })
	@ApiResponse({ status: 200, description: 'Login successful' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Post('refresh')
	@Public()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiResponse({ status: 200, description: 'Token refreshed' })
	@ApiResponse({ status: 401, description: 'Invalid refresh token' })
	refresh(@Body() body: { refreshToken: string }) {
		return this.authService.refresh(body.refreshToken);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({ status: 200, description: 'Return current user' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	me(@CurrentUser() user: RequestUser) {
		return this.authService.getProfile(user.userId);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Logout' })
	@ApiResponse({ status: 200, description: 'Logged out successfully' })
	logout() {
		return { message: 'Logged out successfully' };
	}
}
