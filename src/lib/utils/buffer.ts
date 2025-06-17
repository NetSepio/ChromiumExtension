/**
 * Buffer polyfill utility for browser compatibility
 */

// Simple Buffer polyfill for browser environments
export class BufferPolyfill {
	static from(
		data: string | Uint8Array | number[] | ArrayBufferLike,
		encoding?: string
	): Uint8Array {
		if (data instanceof Uint8Array) {
			return data;
		}

		if (typeof data === 'string') {
			if (encoding === 'hex') {
				// Convert hex string to Uint8Array
				const bytes = [];
				for (let i = 0; i < data.length; i += 2) {
					bytes.push(parseInt(data.substr(i, 2), 16));
				}
				return new Uint8Array(bytes);
			} else {
				// Default to UTF-8 encoding
				return new TextEncoder().encode(data);
			}
		}

		if (Array.isArray(data)) {
			return new Uint8Array(data);
		}

		return new Uint8Array(data);
	}

	static toString(buffer: Uint8Array, encoding?: string): string {
		if (encoding === 'hex') {
			return Array.from(buffer)
				.map((byte) => byte.toString(16).padStart(2, '0'))
				.join('');
		} else {
			// Default to UTF-8 decoding
			return new TextDecoder().decode(buffer);
		}
	}
}

// Try to use native Buffer if available, otherwise use polyfill
export const Buffer =
	typeof globalThis !== 'undefined' && globalThis.Buffer ? globalThis.Buffer : BufferPolyfill;
