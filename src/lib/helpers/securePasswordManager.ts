/**
 * Secure Password Operations Utility
 * Provides a clean interface for password-related operations
 */

import { 
	encryptPassword, 
	decryptPassword, 
	encryptAndStorePassword, 
	authenticateUser, 
	checkAuth, 
	clearWalletData,
	getStorageInfo
} from '../modules/storePassword';
import type { Keypair } from '@solana/web3.js';

export interface AuthStatus {
	hasWallet: boolean;
	isUnlocked: boolean;
	isInitialized: boolean;
}

export interface PasswordValidation {
	isValid: boolean;
	errors: string[];
}

export class SecurePasswordManager {
	/**
	 * Validate password strength
	 */
	static validatePassword(password: string): PasswordValidation {
		const errors: string[] = [];
		
		if (password.length < 6) {
			errors.push('Password must be at least 6 characters long');
		}
		
		if (password.length > 128) {
			errors.push('Password must be less than 128 characters');
		}
		
		if (!/[a-z]/.test(password)) {
			errors.push('Password must contain at least one lowercase letter');
		}
		
		if (!/[A-Z]/.test(password)) {
			errors.push('Password must contain at least one uppercase letter');
		}
		
		if (!/[0-9]/.test(password)) {
			errors.push('Password must contain at least one number');
		}
		
		if (!/[^a-zA-Z0-9]/.test(password)) {
			errors.push('Password must contain at least one special character');
		}
		
		// Check for common weak passwords
		const commonPasswords = [
			'password', '123456', 'password123', 'admin', 'qwerty',
			'letmein', 'welcome', 'monkey', '1234567890'
		];
		
		if (commonPasswords.includes(password.toLowerCase())) {
			errors.push('Password is too common - please choose a stronger password');
		}
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}

	/**
	 * Store password for an existing wallet (when mnemonic is already in store)
	 * This is used in the create-password flow after mnemonic generation
	 */
	static async storeWalletPassword(password: string): Promise<{ success: boolean; error?: string }> {
		try {
			// Validate password strength
			const validation = SecurePasswordManager.validatePassword(password);
			if (!validation.isValid) {
				return { 
					success: false, 
					error: `Password validation failed: ${validation.errors.join(', ')}` 
				};
			}

			// Store encrypted password hash
			const passwordResult = await encryptPassword(password);
			if (!passwordResult) {
				return { success: false, error: 'Failed to encrypt password' };
			}

			// Store encrypted mnemonic (mnemonic should already be in store)
			const mnemonicResult = await encryptAndStorePassword(password);
			if (!mnemonicResult) {
				return { success: false, error: 'Failed to encrypt and store mnemonic' };
			}

			return { success: true };
		} catch (error) {
			console.error('SecurePasswordManager.storeWalletPassword error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			};
		}
	}

	/**
	 * Create a new wallet with password (for import flows)
	 * This is used when importing a wallet or creating from scratch with a custom mnemonic
	 */
	static async createNewWallet(password: string, customMnemonic?: string): Promise<{ success: boolean; error?: string }> {
		try {
			// Validate password strength
			const validation = SecurePasswordManager.validatePassword(password);
			if (!validation.isValid) {
				return { 
					success: false, 
					error: `Password validation failed: ${validation.errors.join(', ')}` 
				};
			}

			// If custom mnemonic provided, set it in store first
			if (customMnemonic) {
				const { mnemonicPhrase } = await import('../../store/store');
				mnemonicPhrase.set(customMnemonic);
			}

			// Store encrypted password hash
			const passwordResult = await encryptPassword(password);
			if (!passwordResult) {
				return { success: false, error: 'Failed to encrypt password' };
			}

			// Store encrypted mnemonic
			const mnemonicResult = await encryptAndStorePassword(password);
			if (!mnemonicResult) {
				return { success: false, error: 'Failed to encrypt and store mnemonic' };
			}

			return { success: true };
		} catch (error) {
			console.error('SecurePasswordManager.createNewWallet error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			};
		}
	}

	/**
	 * Authenticate user with password
	 */
	static async authenticate(password: string): Promise<{ success: boolean; error?: string }> {
		try {
			// First verify password hash
			const passwordValid = await decryptPassword(password);
			if (!passwordValid) {
				return { success: false, error: 'Invalid password' };
			}

			// Then authenticate with mnemonic decryption
			const authResult = await authenticateUser(password);
			if (!authResult) {
				return { success: false, error: 'Authentication failed' };
			}

			return { success: true };
		} catch (error) {
			console.error('SecurePasswordManager.authenticate error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Authentication error' 
			};
		}
	}

	/**
	 * Change wallet password
	 */
	static async changePassword(
		currentPassword: string, 
		newPassword: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Validate current password
			const authResult = await this.authenticate(currentPassword);
			if (!authResult.success) {
				return { success: false, error: 'Current password is incorrect' };
			}

			// Validate new password
			const validation = SecurePasswordManager.validatePassword(newPassword);
			if (!validation.isValid) {
				return { 
					success: false, 
					error: `New password validation failed: ${validation.errors.join(', ')}` 
				};
			}

			// Store new password hash
			const passwordResult = await encryptPassword(newPassword);
			if (!passwordResult) {
				return { success: false, error: 'Failed to encrypt new password' };
			}

			// Re-encrypt mnemonic with new password
			const mnemonicResult = await encryptAndStorePassword(newPassword);
			if (!mnemonicResult) {
				return { success: false, error: 'Failed to re-encrypt mnemonic with new password' };
			}

			return { success: true };
		} catch (error) {
			console.error('SecurePasswordManager.changePassword error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Password change failed' 
			};
		}
	}

	/**
	 * Get wallet authentication status
	 */
	static async getAuthStatus(): Promise<AuthStatus> {
		try {
			const [hasWallet, isUnlocked] = await checkAuth();
			
			return {
				hasWallet,
				isUnlocked,
				isInitialized: hasWallet || isUnlocked
			};
		} catch (error) {
			console.error('SecurePasswordManager.getAuthStatus error:', error);
			return {
				hasWallet: false,
				isUnlocked: false,
				isInitialized: false
			};
		}
	}

	/**
	 * Lock the wallet (clear decrypted data)
	 */
	static async lockWallet(): Promise<{ success: boolean; error?: string }> {
		try {
			// Import stores to clear them
			const { mnemonicPhrase, privateKey, publicKey } = await import('../../store/store');
			
			// Clear sensitive data from memory
			mnemonicPhrase.set('');
			privateKey.set('');
			publicKey.set('');

			return { success: true };
		} catch (error) {
			console.error('SecurePasswordManager.lockWallet error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Failed to lock wallet' 
			};
		}
	}

	/**
	 * Remove wallet completely (delete all data)
	 */
	static async deleteWallet(): Promise<{ success: boolean; error?: string }> {
		try {
			const result = await clearWalletData();
			
			if (result) {
				return { success: true };
			} else {
				return { success: false, error: 'Failed to delete wallet data' };
			}
		} catch (error) {
			console.error('SecurePasswordManager.deleteWallet error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Failed to delete wallet' 
			};
		}
	}

	/**
	 * Get storage usage information
	 */
	static async getStorageUsage(): Promise<{
		used?: number;
		quota?: number;
		usagePercentage?: number;
		error?: string;
	}> {
		try {
			const info = await getStorageInfo();
			
			if (!info) {
				return { error: 'Unable to retrieve storage information' };
			}

			const usagePercentage = info.quotaBytes ? (info.bytesInUse / info.quotaBytes) * 100 : 0;

			return {
				used: info.bytesInUse,
				quota: info.quotaBytes,
				usagePercentage: Math.round(usagePercentage * 100) / 100
			};
		} catch (error) {
			console.error('SecurePasswordManager.getStorageUsage error:', error);
			return { 
				error: error instanceof Error ? error.message : 'Failed to get storage usage' 
			};
		}
	}

	/**
	 * Verify password without full authentication (lighter check)
	 */
	static async verifyPassword(password: string): Promise<boolean> {
		try {
			return await decryptPassword(password);
		} catch (error) {
			console.error('SecurePasswordManager.verifyPassword error:', error);
			return false;
		}
	}

	/**
	 * Generate password strength score (0-100)
	 */
	static getPasswordStrength(password: string): {
		score: number;
		feedback: string[];
	} {
		let score = 0;
		const feedback: string[] = [];

		// Length scoring
		if (password.length >= 6) score += 20;
		else feedback.push('Use at least 6 characters');
		
		if (password.length >= 8) score += 10;
		else if (password.length >= 6) feedback.push('Consider using 8+ characters for better security');

		if (password.length >= 12) score += 10;

		// Character variety scoring
		if (/[a-z]/.test(password)) score += 15;
		else feedback.push('Add lowercase letters');

		if (/[A-Z]/.test(password)) score += 15;
		else feedback.push('Add uppercase letters');

		if (/[0-9]/.test(password)) score += 15;
		else feedback.push('Add numbers');

		if (/[^a-zA-Z0-9]/.test(password)) score += 15;
		else feedback.push('Add special characters (!@#$%^&*)');

		// Pattern penalties
		if (/(.)\1{2,}/.test(password)) {
			score -= 10;
			feedback.push('Avoid repeating characters');
		}

		if (/123|abc|qwe/i.test(password)) {
			score -= 15;
			feedback.push('Avoid common sequences');
		}

		// Common password penalty
		const commonPasswords = [
			'password', '123456', 'password123', 'admin', 'qwerty',
			'letmein', 'welcome', 'monkey', '1234567890'
		];
		
		if (commonPasswords.includes(password.toLowerCase())) {
			score = Math.min(score, 20);
			feedback.push('This password is too common');
		}

		// Additional security bonus
		if (password.length >= 16 && score >= 80) score += 10;

		score = Math.max(0, Math.min(100, score));

		return { score, feedback };
	}

	/**
	 * Get password strength label
	 */
	static getPasswordStrengthLabel(score: number): {
		label: string;
		color: string;
	} {
		if (score >= 80) return { label: 'Very Strong', color: '#16a34a' };
		if (score >= 60) return { label: 'Strong', color: '#65a30d' };
		if (score >= 40) return { label: 'Moderate', color: '#ca8a04' };
		if (score >= 20) return { label: 'Weak', color: '#dc2626' };
		return { label: 'Very Weak', color: '#991b1b' };
	}

	/**
	 * Get wallet keypair for signing transactions
	 * Requires the user to be authenticated
	 */
	static async getWalletKeypair(password: string): Promise<{
		success: boolean;
		keypair?: Keypair;
		error?: string;
	}> {
		try {
			// Verify password first
			const authResult = await this.authenticate(password);
			if (!authResult.success) {
				return { success: false, error: authResult.error };
			}

			// Import Solana keypair utilities
			const { Keypair } = await import('@solana/web3.js');
			const { derivePath } = await import('ed25519-hd-key');
			
			// Get mnemonic from store (should be decrypted after authentication)
			const { mnemonicPhrase } = await import('../../store/store');
			
			const mnemonic = await mnemonicPhrase.get();
			if (!mnemonic) {
				return { success: false, error: 'Wallet not unlocked or mnemonic not found' };
			}

			// Convert mnemonic to seed
			const { mnemonicToSeedSync } = await import('bip39');
			const seed = mnemonicToSeedSync(mnemonic);
			
			// Derive Solana keypair (using standard Solana derivation path)
			const derivationPath = "m/44'/501'/0'/0'";
			const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
			const keypair = Keypair.fromSeed(derivedSeed);

			return { success: true, keypair };
		} catch (error) {
			console.error('SecurePasswordManager.getWalletKeypair error:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Failed to get wallet keypair' 
			};
		}
	}
}

/**
 * Quick access functions for common operations
 * Updated to use the correct method names for the wallet flow
 */
export const passwordUtils = {
	validate: SecurePasswordManager.validatePassword,
	authenticate: SecurePasswordManager.authenticate,
	
	// For the create-password flow (mnemonic already in store)
	storePassword: SecurePasswordManager.storeWalletPassword,
	
	// For import flows or custom wallet creation
	createWallet: SecurePasswordManager.createNewWallet,
	
	changePassword: SecurePasswordManager.changePassword,
	getAuthStatus: SecurePasswordManager.getAuthStatus,
	lockWallet: SecurePasswordManager.lockWallet,
	deleteWallet: SecurePasswordManager.deleteWallet,
	verifyPassword: SecurePasswordManager.verifyPassword,
	getStrength: SecurePasswordManager.getPasswordStrength,
	getStrengthLabel: SecurePasswordManager.getPasswordStrengthLabel,
	getStorageUsage: SecurePasswordManager.getStorageUsage,
	getWalletKeypair: SecurePasswordManager.getWalletKeypair
};
