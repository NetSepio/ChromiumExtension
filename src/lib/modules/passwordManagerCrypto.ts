/**
 * Password Manager Cryptography - Independent encryption for password management
 */

import pkg from 'crypto-js';

const { AES, enc, lib, SHA256, PBKDF2 } = pkg;

export interface EncryptionResult {
	success: boolean;
	data?: string;
	error?: string;
}

export interface DecryptionResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export class PasswordManagerCrypto {
	private static masterKey: CryptoJS.lib.WordArray | null = null;
	private static isInitialized: boolean = false;

	/**
	 * Initialize with a derived master key for password manager
	 */
	static async initialize(): Promise<{ success: boolean; error?: string }> {
		try {
			if (this.isInitialized && this.masterKey) {
				return { success: true };
			}

			// Generate a consistent master key for password manager
			// This uses a deterministic approach based on a constant
			const keyMaterial = 'netsepio-password-manager-master-key-v1';
			const salt = 'netsepio-pm-salt-2024';
			this.masterKey = PBKDF2(keyMaterial, salt, { keySize: 256 / 32, iterations: 10000 });
			this.isInitialized = true;

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Encrypt data using password manager master key
	 */
	static async encryptData<T>(data: T): Promise<EncryptionResult> {
		try {
			// Ensure we have a master key
			if (!this.masterKey) {
				const initResult = await this.initialize();
				if (!initResult.success) {
					return { success: false, error: 'Failed to initialize encryption key' };
				}
			}

			const jsonString = JSON.stringify(data);

			// Generate a random IV for this encryption
			const iv = lib.WordArray.random(128 / 8); // 128-bit IV

			// Encrypt the data using the master key
			const encrypted = AES.encrypt(jsonString, this.masterKey!, { iv: iv });

			// Combine iv and encrypted data for storage
			const combined = {
				iv: iv.toString(),
				data: encrypted.toString()
			};

			return {
				success: true,
				data: JSON.stringify(combined)
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Encryption failed'
			};
		}
	}

	/**
	 * Decrypt data using password manager master key
	 */
	static async decryptData<T>(encryptedData: string): Promise<DecryptionResult<T>> {
		try {
			// Ensure we have a master key
			if (!this.masterKey) {
				const initResult = await this.initialize();
				if (!initResult.success) {
					return { success: false, error: 'Failed to initialize encryption key' };
				}
			}

			const combined = JSON.parse(encryptedData);
			const iv = enc.Hex.parse(combined.iv);

			// Decrypt the data using the master key
			const decrypted = AES.decrypt(combined.data, this.masterKey!, { iv: iv });
			const jsonString = decrypted.toString(enc.Utf8);

			if (!jsonString) {
				return { success: false, error: 'Failed to decrypt data' };
			}

			const data = JSON.parse(jsonString) as T;
			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Decryption failed'
			};
		}
	}

	/**
	 * Check if the password manager is locked (always false since it's independent)
	 */
	static async isLocked(): Promise<boolean> {
		return false; // Password manager is always available once initialized
	}

	/**
	 * Lock the password manager (no-op since it's independent)
	 */
	static async lock(): Promise<void> {
		// No operation needed - password manager doesn't lock
	}

	/**
	 * Generate a secure ID for entries/folders
	 */
	static generateSecureId(): string {
		const randomBytes = lib.WordArray.random(16); // 128 bits
		return randomBytes.toString();
	}

	/**
	 * Encrypt folders data
	 */
	static async encryptFolders(folders: any): Promise<EncryptionResult> {
		return this.encryptData(folders);
	}

	/**
	 * Decrypt folders data
	 */
	static async decryptFolders(encryptedData: string): Promise<DecryptionResult<any>> {
		return this.decryptData(encryptedData);
	}

	/**
	 * Encrypt settings data
	 */
	static async encryptSettings(settings: any): Promise<EncryptionResult> {
		return this.encryptData(settings);
	}

	/**
	 * Decrypt settings data
	 */
	static async decryptSettings(encryptedData: string): Promise<DecryptionResult<any>> {
		return this.decryptData(encryptedData);
	}

	/**
	 * Create integrity hash for data verification
	 */
	static createIntegrityHash(data: string): string {
		return SHA256(data).toString();
	}

	/**
	 * Verify integrity hash
	 */
	static verifyIntegrityHash(data: string, hash: string): boolean {
		const computedHash = this.createIntegrityHash(data);
		return computedHash === hash;
	}
}
