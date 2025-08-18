/**
 * Password Vault Storage Module
 * Handles encrypted storage and retrieval of password manager data
 * Integrates with Chrome's secure storage and encryption systems
 */

import { SecureStorage } from '../helpers/secureStorage';
import { PasswordManagerCrypto } from './passwordManagerCrypto';
import type {
	PasswordEntry,
	PasswordFolder,
	PasswordManagerSettings
} from '../../types/password-manager.types';

// Storage keys for different data types
const STORAGE_KEYS = {
	VAULT: 'pm_encrypted_vault',
	FOLDERS: 'pm_encrypted_folders',
	SETTINGS: 'pm_encrypted_settings',
	METADATA: 'pm_vault_metadata'
} as const;

export interface VaultMetadata {
	version: string;
	createdAt: number;
	lastModified: number;
	entryCount: number;
	checksum: string;
}

export class PasswordVaultStorage {
	/**
	 * Initialize storage with default data structure
	 */
	static async initializeVault(): Promise<{ success: boolean; error?: string }> {
		try {
			// Check if vault already exists
			const vaultExists = await this.vaultExists();
			if (vaultExists) {
				console.log('Password vault already exists');
				return { success: true };
			}

			console.log('Initializing new password vault...');

			// Create default empty vault structure
			const emptyVault: PasswordEntry[] = [];

			// Create default folders
			const defaultFolders: PasswordFolder[] = [
				{
					id: PasswordManagerCrypto.generateSecureId(),
					name: 'Personal',
					parentId: undefined,
					color: '#3B82F6',
					icon: 'user',
					description: 'Personal accounts and services',
					createdAt: Date.now(),
					lastModified: Date.now(),
					entryCount: 0,
					isDefault: true
				},
				{
					id: PasswordManagerCrypto.generateSecureId(),
					name: 'Work',
					parentId: undefined,
					color: '#10B981',
					icon: 'briefcase',
					description: 'Work-related accounts',
					createdAt: Date.now(),
					lastModified: Date.now(),
					entryCount: 0,
					isDefault: true
				},
				{
					id: PasswordManagerCrypto.generateSecureId(),
					name: 'Social',
					parentId: undefined,
					color: '#8B5CF6',
					icon: 'users',
					description: 'Social media accounts',
					createdAt: Date.now(),
					lastModified: Date.now(),
					entryCount: 0,
					isDefault: true
				}
			];

			// Create default settings
			const defaultSettings: PasswordManagerSettings = {
				general: {
					autoLockTimeout: 900, // 15 minutes
					autoSave: true,
					showPasswordStrength: true,
					defaultPasswordLength: 16,
					enableClipboardTimeout: 30,
					showNotifications: true
				},
				security: {
					requireMasterPassword: true,
					enableBiometric: false,
					sessionTimeout: 15, // minutes
					maxLoginAttempts: 3,
					enableBreachMonitoring: true,
					autoLogoutOnSuspend: true
				},
				autofill: {
					enabled: true,
					showAutofillIcon: true,
					autoSubmit: false,
					onlyHTTPS: true,
					matchingStrategy: 'domain',
					confirmBeforeAutofill: true
				},
				backup: {
					enabled: false,
					frequency: 'weekly',
					location: 'local',
					keepBackups: 5,
					encryptBackups: true
				},
				ui: {
					theme: 'dark',
					compactView: false,
					showFavicons: true,
					defaultView: 'list',
					itemsPerPage: 50
				}
			};

			// Encrypt and store all data
			const vaultResult = await PasswordManagerCrypto.encryptData(emptyVault);
			const foldersResult = await PasswordManagerCrypto.encryptFolders(defaultFolders);
			const settingsResult = await PasswordManagerCrypto.encryptSettings(defaultSettings);

			if (!vaultResult.success || !foldersResult.success || !settingsResult.success) {
				return {
					success: false,
					error: 'Failed to encrypt vault data during initialization'
				};
			}

			// Create metadata
			const metadata: VaultMetadata = {
				version: '1.0.0',
				createdAt: Date.now(),
				lastModified: Date.now(),
				entryCount: 0,
				checksum: PasswordManagerCrypto.createIntegrityHash(vaultResult.data!)
			};

			// Store everything
			const storeVault = await SecureStorage.setSecureItem(STORAGE_KEYS.VAULT, vaultResult.data!);
			const storeFolders = await SecureStorage.setSecureItem(
				STORAGE_KEYS.FOLDERS,
				foldersResult.data!
			);
			const storeSettings = await SecureStorage.setSecureItem(
				STORAGE_KEYS.SETTINGS,
				settingsResult.data!
			);
			const storeMetadata = await SecureStorage.setSecureItem(
				STORAGE_KEYS.METADATA,
				JSON.stringify(metadata)
			);

			if (
				!storeVault.success ||
				!storeFolders.success ||
				!storeSettings.success ||
				!storeMetadata.success
			) {
				return { success: false, error: 'Failed to store vault data' };
			}

			console.log('Password vault initialized successfully');
			return { success: true };
		} catch (error) {
			console.error('Failed to initialize vault:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Check if vault exists in storage
	 */
	static async vaultExists(): Promise<boolean> {
		try {
			const result = await SecureStorage.getSecureItem(STORAGE_KEYS.VAULT);
			return result.success && !!result.data;
		} catch (error) {
			console.error('Error checking vault existence:', error);
			return false;
		}
	}

	/**
	 * Load all password entries from storage
	 */
	static async loadAllEntries(): Promise<{
		success: boolean;
		data?: PasswordEntry[];
		error?: string;
	}> {
		try {
			const vaultResult = await SecureStorage.getSecureItem(STORAGE_KEYS.VAULT);
			if (!vaultResult.success || !vaultResult.data) {
				return { success: false, error: 'Vault not found or inaccessible' };
			}

			const decryptResult = await PasswordManagerCrypto.decryptData<PasswordEntry[]>(
				vaultResult.data
			);

			if (!decryptResult.success) {
				return {
					success: false,
					error: decryptResult.error || 'Failed to decrypt vault data'
				};
			}

			return {
				success: true,
				data: decryptResult.data || []
			};
		} catch (error) {
			console.error('Failed to load entries:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Save all password entries to storage
	 */
	static async saveAllEntries(
		entries: PasswordEntry[]
	): Promise<{ success: boolean; error?: string }> {
		try {
			const encryptResult = await PasswordManagerCrypto.encryptData(entries);
			if (!encryptResult.success) {
				return {
					success: false,
					error: encryptResult.error || 'Failed to encrypt entries'
				};
			}

			const storeResult = await SecureStorage.setSecureItem(
				STORAGE_KEYS.VAULT,
				encryptResult.data!
			);
			if (!storeResult.success) {
				return {
					success: false,
					error: storeResult.error || 'Failed to store entries'
				};
			}

			// Update metadata
			await this.updateMetadata(entries.length, encryptResult.data!);

			return { success: true };
		} catch (error) {
			console.error('Failed to save entries:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Load password folders from storage
	 */
	static async loadFolders(): Promise<{
		success: boolean;
		data?: PasswordFolder[];
		error?: string;
	}> {
		try {
			const foldersResult = await SecureStorage.getSecureItem(STORAGE_KEYS.FOLDERS);
			if (!foldersResult.success || !foldersResult.data) {
				return { success: false, error: 'Folders not found' };
			}

			const decryptResult = await PasswordManagerCrypto.decryptFolders(foldersResult.data);
			if (!decryptResult.success) {
				return {
					success: false,
					error: decryptResult.error || 'Failed to decrypt folders'
				};
			}

			return {
				success: true,
				data: decryptResult.data || []
			};
		} catch (error) {
			console.error('Failed to load folders:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Save password folders to storage
	 */
	static async saveFolders(
		folders: PasswordFolder[]
	): Promise<{ success: boolean; error?: string }> {
		try {
			const encryptResult = await PasswordManagerCrypto.encryptFolders(folders);
			if (!encryptResult.success) {
				return {
					success: false,
					error: encryptResult.error || 'Failed to encrypt folders'
				};
			}

			const storeResult = await SecureStorage.setSecureItem(
				STORAGE_KEYS.FOLDERS,
				encryptResult.data!
			);
			if (!storeResult.success) {
				return {
					success: false,
					error: storeResult.error || 'Failed to store folders'
				};
			}

			return { success: true };
		} catch (error) {
			console.error('Failed to save folders:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Load password manager settings from storage
	 */
	static async loadSettings(): Promise<{
		success: boolean;
		data?: PasswordManagerSettings;
		error?: string;
	}> {
		try {
			const settingsResult = await SecureStorage.getSecureItem(STORAGE_KEYS.SETTINGS);
			if (!settingsResult.success || !settingsResult.data) {
				return { success: false, error: 'Settings not found' };
			}

			const decryptResult = await PasswordManagerCrypto.decryptSettings(settingsResult.data);
			if (!decryptResult.success) {
				return {
					success: false,
					error: decryptResult.error || 'Failed to decrypt settings'
				};
			}

			return {
				success: true,
				data: decryptResult.data
			};
		} catch (error) {
			console.error('Failed to load settings:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Save password manager settings to storage
	 */
	static async saveSettings(
		settings: PasswordManagerSettings
	): Promise<{ success: boolean; error?: string }> {
		try {
			const encryptResult = await PasswordManagerCrypto.encryptSettings(settings);
			if (!encryptResult.success) {
				return {
					success: false,
					error: encryptResult.error || 'Failed to encrypt settings'
				};
			}

			const storeResult = await SecureStorage.setSecureItem(
				STORAGE_KEYS.SETTINGS,
				encryptResult.data!
			);
			if (!storeResult.success) {
				return {
					success: false,
					error: storeResult.error || 'Failed to store settings'
				};
			}

			return { success: true };
		} catch (error) {
			console.error('Failed to save settings:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Get vault metadata
	 */
	static async getMetadata(): Promise<{ success: boolean; data?: VaultMetadata; error?: string }> {
		try {
			const result = await SecureStorage.getSecureItem(STORAGE_KEYS.METADATA);
			if (!result.success || !result.data) {
				return { success: false, error: 'Metadata not found' };
			}

			const metadata = JSON.parse(result.data) as VaultMetadata;
			return { success: true, data: metadata };
		} catch (error) {
			console.error('Failed to get metadata:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Update vault metadata
	 */
	static async updateMetadata(
		entryCount: number,
		vaultData: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			const currentMetadata = await this.getMetadata();

			const metadata: VaultMetadata = {
				version: '1.0.0',
				createdAt: currentMetadata.data?.createdAt || Date.now(),
				lastModified: Date.now(),
				entryCount,
				checksum: PasswordManagerCrypto.createIntegrityHash(vaultData)
			};

			const storeResult = await SecureStorage.setSecureItem(
				STORAGE_KEYS.METADATA,
				JSON.stringify(metadata)
			);
			return storeResult;
		} catch (error) {
			console.error('Failed to update metadata:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Clear all password manager data from storage
	 */
	static async clearAllData(): Promise<{ success: boolean; error?: string }> {
		try {
			const results = await Promise.all([
				SecureStorage.removeSecureItem(STORAGE_KEYS.VAULT),
				SecureStorage.removeSecureItem(STORAGE_KEYS.FOLDERS),
				SecureStorage.removeSecureItem(STORAGE_KEYS.SETTINGS),
				SecureStorage.removeSecureItem(STORAGE_KEYS.METADATA)
			]);

			const failed = results.filter((r) => !r.success);
			if (failed.length > 0) {
				return { success: false, error: 'Failed to clear some data' };
			}

			console.log('All password manager data cleared successfully');
			return { success: true };
		} catch (error) {
			console.error('Failed to clear data:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Verify vault integrity using checksums
	 */
	static async verifyIntegrity(): Promise<{ success: boolean; error?: string }> {
		try {
			const metadataResult = await this.getMetadata();
			if (!metadataResult.success || !metadataResult.data) {
				return { success: false, error: 'Cannot verify integrity - metadata missing' };
			}

			const vaultResult = await SecureStorage.getSecureItem(STORAGE_KEYS.VAULT);
			if (!vaultResult.success || !vaultResult.data) {
				return { success: false, error: 'Cannot verify integrity - vault data missing' };
			}

			const isValid = PasswordManagerCrypto.verifyIntegrityHash(
				vaultResult.data,
				metadataResult.data.checksum
			);

			if (!isValid) {
				return { success: false, error: 'Vault integrity check failed - data may be corrupted' };
			}

			return { success: true };
		} catch (error) {
			console.error('Integrity verification failed:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Verification failed'
			};
		}
	}
}
