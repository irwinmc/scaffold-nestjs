import { TrimPipe } from '@/common/pipes/trim.pipe';

describe('TrimPipe', () => {
	const pipe = new TrimPipe();

	describe('primitive types', () => {
		it('should trim leading and trailing whitespace from strings', () => {
			expect(pipe.transform('  hello  ')).toBe('hello');
		});

		it('should return numbers as-is', () => {
			expect(pipe.transform(42)).toBe(42);
		});

		it('should return booleans as-is', () => {
			expect(pipe.transform(true)).toBe(true);
		});

		it('should return null as-is', () => {
			expect(pipe.transform(null)).toBeNull();
		});
	});

	describe('objects', () => {
		it('should trim all string fields in a flat object', () => {
			const input = { name: '  Alice  ', email: '  a@b.com  ' };
			const result = pipe.transform(input) as typeof input;

			expect(result.name).toBe('Alice');
			expect(result.email).toBe('a@b.com');
		});

		it('should recursively trim nested objects', () => {
			const input = { user: { name: '  Bob  ', bio: '  Hello  ' } };
			const result = pipe.transform(input) as { user: { name: string; bio: string } };

			expect(result.user.name).toBe('Bob');
			expect(result.user.bio).toBe('Hello');
		});
	});

	describe('arrays', () => {
		it('should trim each element in a string array', () => {
			const input = ['  a  ', '  b  ', '  c  '];
			const result = pipe.transform(input) as string[];

			expect(result).toEqual(['a', 'b', 'c']);
		});

		it('should only trim strings in a mixed-type array', () => {
			const input = ['  x  ', 1, true, null];
			const result = pipe.transform(input) as unknown[];

			expect(result).toEqual(['x', 1, true, null]);
		});
	});
});
