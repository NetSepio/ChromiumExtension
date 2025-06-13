import { browser } from '$app/environment';
import { mnemonicPhrase, privateKey, publicKey } from '../../store/store';
import pkg from 'crypto-js';
import * as bip39 from 'bip39';
import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit';
import { SecureStorage, StorageMigration } from '../helpers/secureStorage';
import { Buffer } from '$lib/utils/buffer';

const { AES, enc, lib, SHA256, PBKDF2 } = pkg;

// Enhanced security configuration
const SECURITY_CONFIG = {
	PBKDF2_ITERATIONS: 100000, // Increased iterations for better security
	IV_LENGTH: 16,
	SALT_LENGTH: 32,
	KEY_LENGTH: 32,
	PASSWORD_HASH_ITERATIONS: 50000 // For password hashing
} as const;

/**
 * Enhanced encryption function with PBKDF2 key derivation
 */
const encryptWithPBKDF2 = async (
	password: string
): Promise<{
	encryptedData: string;
	iv: pkg.lib.WordArray;
	salt: pkg.lib.WordArray;
}> => {
	const mnemonic = await mnemonicPhrase.get();
	if (!mnemonic) {
		throw new Error('Mnemonic is undefined');
	}

	// Generate random salt and IV
	const salt = lib.WordArray.random(SECURITY_CONFIG.SALT_LENGTH);
	const iv = lib.WordArray.random(SECURITY_CONFIG.IV_LENGTH);

	// Derive key using PBKDF2
	const key = PBKDF2(password, salt, {
		keySize: SECURITY_CONFIG.KEY_LENGTH / 4, // WordArray units
		iterations: SECURITY_CONFIG.PBKDF2_ITERATIONS,
		hasher: pkg.algo.SHA512
	});

	// Encrypt mnemonic
	const encrypted = AES.encrypt(mnemonic, key, { iv: iv }).toString();

	// Store hash for verification
	const hash = SHA256(mnemonic).toString(enc.Hex);
	await SecureStorage.setSecureItem(SecureStorage.KEYS.MNEMONIC_HASH, hash);

	return {
		encryptedData: encrypted,
		iv: iv,
		salt: salt
	};
};

/**
 * Enhanced decryption function with PBKDF2 key derivation
 */
const decryptWithPBKDF2 = (
	encryptedData: string,
	password: string,
	iv: pkg.lib.WordArray,
	salt: pkg.lib.WordArray
): string => {
	// Derive the same key using stored salt
	const key = PBKDF2(password, salt, {
		keySize: SECURITY_CONFIG.KEY_LENGTH / 4,
		iterations: SECURITY_CONFIG.PBKDF2_ITERATIONS,
		hasher: pkg.algo.SHA512
	});

	// Decrypt data
	const decrypted = AES.decrypt(encryptedData, key, { iv: iv }).toString(enc.Utf8);
	return decrypted;
};

/**
 * Browser-friendly password hashing using PBKDF2 instead of bcrypt
 */
const hashPasswordPBKDF2 = (password: string, salt: pkg.lib.WordArray): string => {
	const hash = PBKDF2(password, salt, {
		keySize: 256 / 32, // 256 bits = 8 words of 32 bits
		iterations: SECURITY_CONFIG.PASSWORD_HASH_ITERATIONS,
		hasher: pkg.algo.SHA256
	});
	
	// Combine salt and hash for storage
	const combined = salt.concat(hash);
	return combined.toString(enc.Base64);
};

/**
 * Verify password using PBKDF2
 */
const verifyPasswordPBKDF2 = (password: string, storedHash: string): boolean => {
	try {
		// Parse the stored hash to extract salt and hash
		const combined = enc.Base64.parse(storedHash);
		const saltSize = SECURITY_CONFIG.SALT_LENGTH / 4; // Convert bytes to words
		
		// Extract salt (first part) and stored hash (second part)
		const salt = lib.WordArray.create(combined.words.slice(0, saltSize));
		const originalHash = lib.WordArray.create(combined.words.slice(saltSize));
		
		// Hash the provided password with the same salt
		const computedHash = PBKDF2(password, salt, {
			keySize: 256 / 32,
			iterations: SECURITY_CONFIG.PASSWORD_HASH_ITERATIONS,
			hasher: pkg.algo.SHA256
		});
		
		// Compare hashes
		return computedHash.toString() === originalHash.toString();
	} catch (error) {
		console.error('Error verifying password:', error);
		return false;
	}
};

/**
 * Enhanced function to encrypt and store password with secure storage
 */
export async function encryptAndStorePassword(newPassword: string): Promise<boolean> {
	try {
		// Check for and migrate legacy data first
		if (StorageMigration.hasLegacyData()) {
			const migrationResult = await StorageMigration.migrateLegacyStorage();
			if (!migrationResult.success) {
				console.error('Failed to migrate legacy storage:', migrationResult.error);
				// Continue anyway, but log the issue
			}
		}

		const encryptedData = await encryptWithPBKDF2(newPassword);

		// Store all encrypted data securely
		const storeResult = await SecureStorage.setMultipleSecureItems({
			[SecureStorage.KEYS.IV]: encryptedData.iv.toString(),
			[SecureStorage.KEYS.ENCRYPTED_MNEMONIC]: encryptedData.encryptedData,
			[SecureStorage.KEYS.SALT]: encryptedData.salt.toString()
		});

		// SECURITY: Clear temporary mnemonic from memory after encryption
		if (storeResult.success) {
			await mnemonicPhrase.remove();
			console.log('Mnemonic successfully encrypted and temporary copy cleared from memory');
		}

		return storeResult.success;
	} catch (error) {
		console.error('encryptAndStorePassword error:', error);
		return false;
	}
}

/**
 * Enhanced function to encrypt and store password hash using PBKDF2
 */
export async function encryptPassword(password: string): Promise<boolean> {
	try {
		// Generate a random salt for password hashing
		const salt = lib.WordArray.random(SECURITY_CONFIG.SALT_LENGTH);
		
		// Hash password using PBKDF2
		const hash = hashPasswordPBKDF2(password, salt);

		if (hash) {
			const storeResult = await SecureStorage.setSecureItem(SecureStorage.KEYS.PASSWORD_HASH, hash);
			return storeResult.success;
		}

		return false;
	} catch (error) {
		console.error('encryptPassword error:', error);
		return false;
	}
}

/**
 * Enhanced function to decrypt and verify password using PBKDF2
 */
export async function decryptPassword(password: string): Promise<boolean> {
	try {
		const hashResult = await SecureStorage.getSecureItem(SecureStorage.KEYS.PASSWORD_HASH);

		if (!hashResult.success || !hashResult.data) {
			// Check for legacy bcrypt hash and migrate if found
			const legacyHash = localStorage.getItem('passwordHash');
			if (legacyHash) {
				console.log('Found legacy bcrypt hash, migration needed on next password change');
				// For now, return false to force user to reset password
				// You could implement bcrypt verification here if needed for migration
				return false;
			}
			return false;
		}

		const isCorrectPassword = verifyPasswordPBKDF2(password, hashResult.data);
		return isCorrectPassword;
	} catch (error) {
		console.error('decryptPassword error:', error);
		return false;
	}
}

/**
 * Enhanced user authentication with secure storage
 */
export async function authenticateUser(userPassword: string): Promise<boolean> {
	try {
		console.log('Authenticating user...');

		// Get all required data from secure storage
		const storageResult = await SecureStorage.getMultipleSecureItems([
			SecureStorage.KEYS.IV,
			SecureStorage.KEYS.ENCRYPTED_MNEMONIC,
			SecureStorage.KEYS.MNEMONIC_HASH,
			SecureStorage.KEYS.SALT
		]);

		if (!storageResult.success || !storageResult.data) {
			console.error('Failed to retrieve authentication data');
			return false;
		}

		const {
			[SecureStorage.KEYS.IV]: ivString,
			[SecureStorage.KEYS.ENCRYPTED_MNEMONIC]: encryptedMnemonic,
			[SecureStorage.KEYS.MNEMONIC_HASH]: originalMnemonicHash,
			[SecureStorage.KEYS.SALT]: saltString
		} = storageResult.data;

		if (!ivString || !encryptedMnemonic || !originalMnemonicHash) {
			console.error('Missing required authentication data');
			return false;
		}

		// Parse IV and salt
		const iv = enc.Hex.parse(ivString);
		const salt = saltString ? enc.Hex.parse(saltString) : undefined;

		// Decrypt mnemonic
		let decryptedMnemonic: string;

		if (salt) {
			// Use enhanced decryption with PBKDF2
			decryptedMnemonic = decryptWithPBKDF2(encryptedMnemonic, userPassword, iv, salt);
		} else {
			// Fallback to legacy decryption for backward compatibility
			decryptedMnemonic = AES.decrypt(encryptedMnemonic, userPassword, { iv: iv }).toString(
				enc.Utf8
			);
		}

		if (!decryptedMnemonic) {
			console.error('Failed to decrypt mnemonic');
			return false;
		}

		// Verify mnemonic integrity
		const decryptedMnemonicHash = SHA256(decryptedMnemonic).toString(enc.Hex);

		if (decryptedMnemonicHash !== originalMnemonicHash) {
			console.error('Mnemonic hash mismatch - possible tampering or wrong password');
			return false;
		}

		// Generate wallet data from mnemonic
		const seed = bip39.mnemonicToSeedSync(decryptedMnemonic, '');
		const privateKeyBytes = seed.subarray(0, 32);
		const signer = await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes));

		// Update stores
		privateKey.set(Buffer.from(privateKeyBytes).toString('hex'));
		publicKey.set(signer.address.toString());
		mnemonicPhrase.set(decryptedMnemonic); // Store actual mnemonic, not hash

		console.log('Authentication successful');
		return true;
	} catch (error) {
		console.error('authenticateUser error:', error);
		return false;
	}
}

/**
 * Enhanced authentication status check with secure storage
 */
export async function checkAuth(): Promise<boolean[]> {
	try {
		const decryptedMnemonic = browser && (await mnemonicPhrase.get());

		// Check if encrypted mnemonic exists in secure storage
		const encryptedMnemonicResult = await SecureStorage.getSecureItem(
			SecureStorage.KEYS.ENCRYPTED_MNEMONIC
		);

		const returnVar = [false, false]; // 0th is hasEncryptedData, 1st is hasDecryptedData

		returnVar[0] = encryptedMnemonicResult.success && !!encryptedMnemonicResult.data;
		returnVar[1] = !!decryptedMnemonic;

		return returnVar;
	} catch (error) {
		console.error('checkAuth error:', error);
		return [false, false];
	}
}

/**
 * Clear all wallet data from secure storage
 */
export async function clearWalletData(): Promise<boolean> {
	try {
		const clearResult = await SecureStorage.clearWalletData();

		if (clearResult.success) {
			// Clear stores as well
			mnemonicPhrase.set('');
			privateKey.set('');
			publicKey.set('');
		}

		return clearResult.success;
	} catch (error) {
		console.error('clearWalletData error:', error);
		return false;
	}
}

/**
 * Initialize secure storage - run this when extension starts
 */
export async function initializeSecureStorage(): Promise<void> {
	try {
		// Check if we need to migrate legacy data
		if (StorageMigration.hasLegacyData()) {
			console.log('Legacy data detected, initiating migration...');
			const migrationResult = await StorageMigration.migrateLegacyStorage();

			if (migrationResult.success) {
				console.log('Legacy data migration completed successfully');
			} else {
				console.error('Legacy data migration failed:', migrationResult.error);
			}
		}

		// Check if wallet data exists
		const hasWallet = await SecureStorage.hasWalletData();
		console.log('Wallet data exists:', hasWallet);
	} catch (error) {
		console.error('initializeSecureStorage error:', error);
	}
}

/**
 * Get storage usage information for debugging
 */
export async function getStorageInfo(): Promise<{bytesInUse: number; quotaBytes: number} | null> {
	try {
		const infoResult = await SecureStorage.getStorageInfo();
		return infoResult.success ? infoResult.data || null : null;
	} catch (error) {
		console.error('getStorageInfo error:', error);
		return null;
	}
}
