import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterSchema = z.object({
	email: z.string().email(),
	username: z.string().min(2).max(100),
	password: z.string().min(6).max(255),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
