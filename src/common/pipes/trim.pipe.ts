import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
	transform(value: unknown) {
		if (typeof value === 'string') {
			return value.trim();
		}

		if (typeof value === 'object' && value !== null) {
			return this.trimDeep(value as Record<string, unknown>);
		}

		return value;
	}

	private trimDeep(obj: Record<string, unknown>): Record<string, unknown> {
		const result: Record<string, unknown> = {};

		for (const [key, val] of Object.entries(obj)) {
			if (typeof val === 'string') {
				result[key] = val.trim();
			} else if (Array.isArray(val)) {
				result[key] = val.map(item => (typeof item === 'string' ? item.trim() : item));
			} else if (typeof val === 'object' && val !== null) {
				result[key] = this.trimDeep(val as Record<string, unknown>);
			} else {
				result[key] = val;
			}
		}

		return result;
	}
}
