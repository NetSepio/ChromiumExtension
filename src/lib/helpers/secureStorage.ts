/**
 * Secure Storage Helper for Chrome Extension
 * Uses Chrome's secure storage APIs instead of localStorage
 */

// Type definitions for our secure storage
export interface SecureStorageData {
	encryptedMnemonic?: string;
	mnemonicHash?: string;
	passwordHash?: string;
	iv?: string;
	salt?: string;
	lastAccess?: number;
}

export interface StorageResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export class SecureStorage {
	private static readonly STORAGE_KEYS = {
		ENCRYPTED_MNEMONIC: 'encrypted_mnemonic',
		MNEMONIC_HASH: 'mnemonic_hash',
		PASSWORD_HASH: 'password_hash',
		IV: 'initialization_vector',
		SALT: 'password_salt',
		LAST_ACCESS: 'last_access'
	} as const;

	/**
	 * Store sensitive data using Chrome's secure storage
	 * Uses chrome.storage.local which is encrypted and isolated per extension
	 */
	static async setSecureItem(key: string, value: string): Promise<StorageResult<void>> {
		try {
			const storageData = { [key]: value };
			await chrome.storage.local.set(storageData);

			// Update last access time
			await chrome.storage.local.set({
				[this.STORAGE_KEYS.LAST_ACCESS]: Date.now()
			});

			return { success: true };
		} catch (error) {
			console.error('SecureStorage.setSecureItem error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Retrieve sensitive data from Chrome's secure storage
	 */
	static async getSecureItem(key: string): Promise<StorageResult<string>> {
		try {
			const result = await chrome.storage.local.get([key]);
			const value = result[key];

			if (value === undefined) {
				return {
					success: false,
					error: 'Item not found'
				};
			}

			return {
				success: true,
				data: value
			};
		} catch (error) {
			console.error('SecureStorage.getSecureItem error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Remove sensitive data from secure storage
	 */
	static async removeSecureItem(key: string): Promise<StorageResult<void>> {
		try {
			await chrome.storage.local.remove([key]);
			return { success: true };
		} catch (error) {
			console.error('SecureStorage.removeSecureItem error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Store multiple secure items at once
	 */
	static async setMultipleSecureItems(items: Record<string, string>): Promise<StorageResult<void>> {
		try {
			const storageData = {
				...items,
				[this.STORAGE_KEYS.LAST_ACCESS]: Date.now()
			};

			await chrome.storage.local.set(storageData);
			return { success: true };
		} catch (error) {
			console.error('SecureStorage.setMultipleSecureItems error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Get multiple secure items at once
	 */
	static async getMultipleSecureItems(
		keys: string[]
	): Promise<StorageResult<Record<string, string>>> {
		try {
			const result = await chrome.storage.local.get(keys);
			return {
				success: true,
				data: result
			};
		} catch (error) {
			console.error('SecureStorage.getMultipleSecureItems error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Clear all wallet-related secure data
	 */
	static async clearWalletData(): Promise<StorageResult<void>> {
		try {
			const keysToRemove = Object.values(this.STORAGE_KEYS);
			await chrome.storage.local.remove(keysToRemove);
			return { success: true };
		} catch (error) {
			console.error('SecureStorage.clearWalletData error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Check if wallet data exists
	 */
	static async hasWalletData(): Promise<boolean> {
		try {
			const result = await chrome.storage.local.get([
				this.STORAGE_KEYS.ENCRYPTED_MNEMONIC,
				this.STORAGE_KEYS.PASSWORD_HASH
			]);

			return !!(
				result[this.STORAGE_KEYS.ENCRYPTED_MNEMONIC] && result[this.STORAGE_KEYS.PASSWORD_HASH]
			);
		} catch (error) {
			console.error('SecureStorage.hasWalletData error:', error);
			return false;
		}
	}

	/**
	 * Get storage usage information
	 */
	static async getStorageInfo(): Promise<
		StorageResult<{ bytesInUse: number; quotaBytes: number }>
	> {
		try {
			// Use the correct Chrome storage API method
			const bytesInUse = await chrome.storage.local.getBytesInUse();
			const quotaBytes = chrome.storage.local.QUOTA_BYTES;

			return {
				success: true,
				data: {
					bytesInUse,
					quotaBytes
				}
			};
		} catch (error) {
			console.error('SecureStorage.getStorageInfo error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Session-based storage for temporary sensitive data
	 * This data is cleared when the extension is reloaded
	 */
	static async setSessionItem(key: string, value: string): Promise<StorageResult<void>> {
		try {
			const storageData = { [key]: value };
			await chrome.storage.session.set(storageData);
			return { success: true };
		} catch (error) {
			console.error('SecureStorage.setSessionItem error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Get item from session storage
	 */
	static async getSessionItem(key: string): Promise<StorageResult<string>> {
		try {
			const result = await chrome.storage.session.get([key]);
			const value = result[key];

			if (value === undefined) {
				return {
					success: false,
					error: 'Session item not found'
				};
			}

			return {
				success: true,
				data: value
			};
		} catch (error) {
			console.error('SecureStorage.getSessionItem error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * JWT token management methods
	 */
	static async setJWTToken(
		token: string,
		useSession: boolean = true
	): Promise<StorageResult<void>> {
		try {
			if (useSession) {
				// Use session storage for temporary JWT tokens
				return await this.setSessionItem('jwt_token', token);
			} else {
				// Use local storage for persistent JWT tokens
				return await this.setSecureItem('jwt_token', token);
			}
		} catch (error) {
			console.error('SecureStorage.setJWTToken error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to store JWT token'
			};
		}
	}

	/**
	 * Get JWT token from secure storage
	 */
	static async getJWTToken(): Promise<StorageResult<string>> {
		try {
			// Try session storage first (preferred for JWTs)
			const sessionResult = await this.getSessionItem('jwt_token');
			if (sessionResult.success && sessionResult.data) {
				return sessionResult;
			}

			// Fallback to local storage
			const localResult = await this.getSecureItem('jwt_token');
			if (localResult.success && localResult.data) {
				return localResult;
			}

			// Fallback to localStorage for backward compatibility
			const legacyToken = localStorage.getItem('jwtToken');
			if (legacyToken) {
				// Migrate to secure storage
				await this.setJWTToken(legacyToken, true);
				// Remove from localStorage
				localStorage.removeItem('jwtToken');
				return { success: true, data: legacyToken };
			}

			return {
				success: false,
				error: 'JWT token not found'
			};
		} catch (error) {
			console.error('SecureStorage.getJWTToken error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to retrieve JWT token'
			};
		}
	}

	/**
	 * Remove JWT token from all storage locations
	 */
	static async removeJWTToken(): Promise<StorageResult<void>> {
		try {
			// Remove from session storage
			await chrome.storage.session.remove(['jwt_token']);

			// Remove from local storage
			await this.removeSecureItem('jwt_token');

			// Remove from legacy localStorage
			localStorage.removeItem('jwtToken');

			return { success: true };
		} catch (error) {
			console.error('SecureStorage.removeJWTToken error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to remove JWT token'
			};
		}
	}

	// Utility getters for common storage keys
	static get KEYS() {
		return this.STORAGE_KEYS;
	}
}

/**
 * Migration helper to move data from localStorage to secure storage
 */
export class StorageMigration {
	private static readonly LEGACY_KEYS = ['mnemonicHash', 'encryptedMnemonic', 'passwordHash', 'iv'];

	/**
	 * Migrate data from localStorage to Chrome secure storage
	 */
	static async migrateLegacyStorage(): Promise<StorageResult<void>> {
		try {
			const legacyData: Record<string, string> = {};

			// Collect all legacy data
			for (const key of this.LEGACY_KEYS) {
				const value = localStorage.getItem(key);
				if (value) {
					legacyData[key] = value;
				}
			}

			if (Object.keys(legacyData).length === 0) {
				return { success: true }; // No legacy data to migrate
			}

			// Map legacy keys to new secure keys
			const secureData: Record<string, string> = {};

			if (legacyData.mnemonicHash) {
				secureData[SecureStorage.KEYS.MNEMONIC_HASH] = legacyData.mnemonicHash;
			}
			if (legacyData.encryptedMnemonic) {
				secureData[SecureStorage.KEYS.ENCRYPTED_MNEMONIC] = legacyData.encryptedMnemonic;
			}
			if (legacyData.passwordHash) {
				secureData[SecureStorage.KEYS.PASSWORD_HASH] = legacyData.passwordHash;
			}
			if (legacyData.iv) {
				secureData[SecureStorage.KEYS.IV] = legacyData.iv;
			}

			// Store in secure storage
			const storeResult = await SecureStorage.setMultipleSecureItems(secureData);

			if (storeResult.success) {
				// Clear legacy data
				for (const key of this.LEGACY_KEYS) {
					localStorage.removeItem(key);
				}

				console.log('Legacy storage migration completed successfully');
				return { success: true };
			} else {
				return storeResult;
			}
		} catch (error) {
			console.error('StorageMigration.migrateLegacyStorage error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Migration failed'
			};
		}
	}

	/**
	 * Check if legacy data exists in localStorage
	 */
	static hasLegacyData(): boolean {
		return this.LEGACY_KEYS.some((key) => localStorage.getItem(key) !== null);
	}
}
