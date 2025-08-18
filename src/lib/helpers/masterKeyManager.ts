/**
 * Master Key Manager
 * Handles secure key derivation and management for password manager integration
 * Provides unified key management between wallet and password manager
 */

import { passwordUtils } from './securePasswordManager';
import { SecureStorage } from './secureStorage';
import pkg from 'crypto-js';

const { PBKDF2, lib, enc } = pkg;

// Security configuration matching wallet standards
const SECURITY_CONFIG = {
	PBKDF2_ITERATIONS: 100000,
	SALT_LENGTH: 32,
	KEY_LENGTH: 32,
	SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
} as const;

interface DerivedKey {
	key: pkg.lib.WordArray;
	derivedAt: number;
	expiresAt: number;
}

export class MasterKeyManager {
	private static instance: MasterKeyManager | null = null;
	private static sessionPassword: string | null = null;
	private static derivedKeys: Map<string, DerivedKey> = new Map();

	// Ensure static properties are properly initialized
	private static ensureStaticInit() {
		if (!this.derivedKeys) {
			this.derivedKeys = new Map();
		}
	}

	// Ensure derivedKeys is always initialized
	private static ensureInitialized(): void {
		if (!this.derivedKeys || !(this.derivedKeys instanceof Map)) {
			this.derivedKeys = new Map<string, DerivedKey>();
			console.log('MasterKeyManager: Reinitializing derivedKeys Map');
		}
	}

	static getInstance(): MasterKeyManager {
		if (!this.instance) {
			this.instance = new MasterKeyManager();
		}
		MasterKeyManager.ensureInitialized();
		return this.instance;
	}

	private constructor() {
		// Private constructor for singleton pattern
	}

	/**
	 * Store the master password in memory for the session
	 * Called after successful wallet authentication
	 */
	static setSessionPassword(password: string): void {
		this.sessionPassword = password;
		console.log('Master password stored in session');

		// Set session timeout
		setTimeout(() => {
			this.clearSession();
		}, SECURITY_CONFIG.SESSION_TIMEOUT);
	}

	/**
	 * Get the authenticated master password from current session
	 * This is the key integration point between wallet and password manager
	 */
	static async getAuthenticatedMasterPassword(): Promise<{
		success: boolean;
		password?: string;
		error?: string;
	}> {
		try {
			// First check if we have it in session memory
			if (this.sessionPassword) {
				// Verify it's still valid by checking wallet authentication
				const authCheck = await passwordUtils.authenticate(this.sessionPassword);
				if (authCheck.success) {
					return { success: true, password: this.sessionPassword };
				} else {
					// Session password is invalid, clear it
					this.clearSession();
				}
			}

			// Try to derive from current wallet session
			// This would typically involve checking if wallet is currently unlocked
			// and extracting the password from secure session storage

			// For now, we need the user to be authenticated through normal flow
			return {
				success: false,
				error: 'Master password not available in session. Please authenticate first.'
			};
		} catch (error) {
			console.error('Failed to get authenticated master password:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to retrieve master password'
			};
		}
	}

	/**
	 * Derive a purpose-specific key from the master password
	 * Uses different salts for different purposes (wallet, password manager, etc.)
	 */
	static async deriveKey(
		purpose: 'password_manager' | 'wallet_backup' | 'secure_notes',
		forceRefresh: boolean = false
	): Promise<{ success: boolean; key?: pkg.lib.WordArray; error?: string }> {
		try {
			// Ensure derivedKeys is properly initialized
			MasterKeyManager.ensureStaticInit();

			// Check if we already have a valid derived key
			const existing = this.derivedKeys.get(purpose);
			if (existing && !forceRefresh && Date.now() < existing.expiresAt) {
				return { success: true, key: existing.key };
			}

			// Get the master password
			const passwordResult = await this.getAuthenticatedMasterPassword();
			if (!passwordResult.success || !passwordResult.password) {
				return { success: false, error: passwordResult.error };
			}

			// Get or create salt for this purpose
			const saltKey = `${purpose}_key_salt`;
			const saltResult = await SecureStorage.getSecureItem(saltKey);
			let salt: pkg.lib.WordArray;

			if (!saltResult.success || !saltResult.data) {
				// Create new salt for first-time setup
				salt = lib.WordArray.random(SECURITY_CONFIG.SALT_LENGTH);
				await SecureStorage.setSecureItem(saltKey, salt.toString());
				console.log(`Created new salt for ${purpose}`);
			} else {
				salt = enc.Hex.parse(saltResult.data);
			}

			// Derive purpose-specific key
			// Add purpose suffix to ensure different keys for different uses
			const keyDerivationInput = passwordResult.password + `_${purpose}`;
			const derivedKey = PBKDF2(keyDerivationInput, salt, {
				keySize: SECURITY_CONFIG.KEY_LENGTH / 4,
				iterations: SECURITY_CONFIG.PBKDF2_ITERATIONS,
				hasher: pkg.algo.SHA512
			});

			// Store in memory with expiration
			const keyData: DerivedKey = {
				key: derivedKey,
				derivedAt: Date.now(),
				expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT
			};
			this.derivedKeys.set(purpose, keyData);

			console.log(`Derived key for ${purpose} successfully`);
			return { success: true, key: derivedKey };
		} catch (error) {
			console.error(`Failed to derive key for ${purpose}:`, error);
			return {
				success: false,
				error: error instanceof Error ? error.message : `Failed to derive ${purpose} key`
			};
		}
	}

	/**
	 * Clear all session data and derived keys
	 * Called on logout or session timeout
	 */
	static clearSession(): void {
		this.sessionPassword = null;
		MasterKeyManager.ensureInitialized();
		this.derivedKeys.clear();
		console.log('Master key session cleared');
	}

	/**
	 * Check if master password is available in current session
	 */
	static hasSessionPassword(): boolean {
		return this.sessionPassword !== null;
	}

	/**
	 * Get session info for debugging
	 */
	static getSessionInfo(): {
		hasPassword: boolean;
		derivedKeysCount: number;
		sessionAge?: number;
	} {
		// Initialize derivedKeys if it doesn't exist (safety check)
		if (!this.derivedKeys) {
			this.derivedKeys = new Map();
		}

		return {
			hasPassword: this.sessionPassword !== null,
			derivedKeysCount: this.derivedKeys.size,
			sessionAge: this.sessionPassword ? Date.now() : undefined
		};
	}
}

// Export convenience functions
export const masterKeyManager = MasterKeyManager.getInstance();

export const getAuthenticatedMasterPassword = MasterKeyManager.getAuthenticatedMasterPassword;
export const deriveKey = MasterKeyManager.deriveKey;
export const setSessionPassword = MasterKeyManager.setSessionPassword;
export const clearMasterKeySession = MasterKeyManager.clearSession;
