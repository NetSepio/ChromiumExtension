/**
 * Comprehensive Authentication Utility
 * Handles all wallet and JWT authentication logic securely
 */

import { SecureStorage } from './secureStorage';
import { getWalletAddress, setWalletAddress, clearWalletAddress } from '../../store/store';
import { checkAuth } from '../modules/storePassword';

export interface AuthStatus {
	// Wallet status
	hasWallet: boolean;           // Encrypted wallet exists in secure storage
	walletAddress?: string;       // Current wallet address (if available)
	
	// Authentication status  
	isAuthenticated: boolean;     // Has valid JWT token
	hasValidToken: boolean;       // JWT token exists and is accessible
	
	// User flow indicators
	isFirstTime: boolean;         // No wallet exists - redirect to welcome
	needsSignIn: boolean;         // Has wallet but no token - redirect to sign-in
	canAccessVPN: boolean;        // Fully authenticated - can use VPN
	canSubmitReviews: boolean;    // Fully authenticated - can submit reviews
	
	// Additional info
	tokenSource?: 'session' | 'local' | 'legacy'; // Where token was found
	migrationNeeded?: boolean;    // If legacy data needs migration
}

export class AuthenticationManager {
	
	/**
	 * Get comprehensive authentication status
	 */
	static async getAuthStatus(): Promise<AuthStatus> {
		try {
			// Check if wallet exists (encrypted mnemonic in secure storage)
			const [hasEncryptedWallet, hasDecryptedWallet] = await checkAuth();
			
			// Get current wallet address
			const walletAddress = await getWalletAddress();
			
			// Check JWT token status
			const tokenStatus = await this.checkJWTToken();
			
			// Determine user flow
			const isFirstTime = !hasEncryptedWallet && !hasDecryptedWallet;
			const needsSignIn = hasEncryptedWallet && !tokenStatus.isValid;
			const isAuthenticated = hasEncryptedWallet && tokenStatus.isValid;
			const canAccessVPN = isAuthenticated && !!walletAddress;
			const canSubmitReviews = isAuthenticated && !!walletAddress;
			
			return {
				// Wallet status
				hasWallet: hasEncryptedWallet,
				walletAddress: walletAddress || undefined,
				
				// Authentication status
				isAuthenticated,
				hasValidToken: tokenStatus.isValid,
				
				// User flow indicators
				isFirstTime,
				needsSignIn,
				canAccessVPN,
				canSubmitReviews,
				
				// Additional info
				tokenSource: tokenStatus.source,
				migrationNeeded: tokenStatus.foundLegacy
			};
		} catch (error) {
			console.error('AuthenticationManager.getAuthStatus error:', error);
			
			// Return safe default state on error
			return {
				hasWallet: false,
				isAuthenticated: false,
				hasValidToken: false,
				isFirstTime: true,
				needsSignIn: false,
				canAccessVPN: false,
				canSubmitReviews: false
			};
		}
	}
	
	/**
	 * Check JWT token validity and source
	 */
	private static async checkJWTToken(): Promise<{
		isValid: boolean;
		source?: 'session' | 'local' | 'legacy';
		token?: string;
		foundLegacy: boolean;
	}> {
		try {
			// Try session storage first (preferred for JWTs)
			const sessionResult = await SecureStorage.getSessionItem('jwt_token');
			if (sessionResult.success && sessionResult.data) {
				return {
					isValid: true,
					source: 'session',
					token: sessionResult.data,
					foundLegacy: false
				};
			}
			
			// Try local secure storage
			const localResult = await SecureStorage.getSecureItem('jwt_token');
			if (localResult.success && localResult.data) {
				return {
					isValid: true,
					source: 'local',
					token: localResult.data,
					foundLegacy: false
				};
			}
			
			// Check legacy localStorage
			const legacyToken = localStorage.getItem('jwtToken');
			if (legacyToken) {
				// Migrate to secure storage
				await SecureStorage.setSessionItem('jwt_token', legacyToken);
				localStorage.removeItem('jwtToken');
				
				return {
					isValid: true,
					source: 'legacy',
					token: legacyToken,
					foundLegacy: true
				};
			}
			
			return {
				isValid: false,
				foundLegacy: false
			};
		} catch (error) {
			console.error('Error checking JWT token:', error);
			return {
				isValid: false,
				foundLegacy: false
			};
		}
	}
	
	/**
	 * Store JWT token securely
	 */
	static async storeJWTToken(token: string, persistent: boolean = false): Promise<boolean> {
		try {
			// Store in session storage by default (clears on extension reload)
			const sessionResult = await SecureStorage.setSessionItem('jwt_token', token);
			
			// Optionally store in local secure storage for persistence
			if (persistent) {
				await SecureStorage.setSecureItem('jwt_token', token);
			}
			
			// Clear any legacy localStorage token
			localStorage.removeItem('jwtToken');
			
			return sessionResult.success;
		} catch (error) {
			console.error('Error storing JWT token:', error);
			return false;
		}
	}
	
	/**
	 * Logout user (clear tokens but keep wallet data)
	 */
	static async logout(): Promise<boolean> {
		try {
			// Remove JWT tokens from all locations
			await SecureStorage.removeJWTToken();
			
			// Clear wallet address from memory/session (but keep encrypted wallet)
			clearWalletAddress();
			
			// Clear sensitive data from stores
			const { privateKey, publicKey, mnemonicPhrase } = await import('../../store/store');
			privateKey.set('');
			publicKey.set('');
			await mnemonicPhrase.remove();
			
			console.log('User logged out successfully - wallet data preserved');
			return true;
		} catch (error) {
			console.error('Error during logout:', error);
			return false;
		}
	}
	
	/**
	 * Check if wallet address is available and valid
	 */
	static async validateWalletAddress(): Promise<string | null> {
		try {
			const address = await getWalletAddress();
			
			// Basic validation (Solana address should be ~44 characters)
			if (address && address !== 'none' && address.length > 32) {
				return address;
			}
			
			return null;
		} catch (error) {
			console.error('Error validating wallet address:', error);
			return null;
		}
	}
	
	/**
	 * Update wallet address securely
	 */
	static async updateWalletAddress(address: string): Promise<boolean> {
		try {
			await setWalletAddress(address);
			return true;
		} catch (error) {
			console.error('Error updating wallet address:', error);
			return false;
		}
	}
	
	/**
	 * Clean up all sensitive data (complete wallet removal)
	 */
	static async deleteWallet(): Promise<boolean> {
		try {
			// Clear all secure storage
			await SecureStorage.clearWalletData();
			await SecureStorage.removeJWTToken();
			
			// Clear all stores
			clearWalletAddress();
			const { privateKey, publicKey, mnemonicPhrase } = await import('../../store/store');
			privateKey.set('');
			publicKey.set('');
			await mnemonicPhrase.remove();
			
			// Clear any remaining localStorage data
			localStorage.removeItem('walletAddress');
			localStorage.removeItem('jwtToken');
			localStorage.removeItem('passwordHash');
			localStorage.removeItem('iv');
			
			console.log('Wallet completely deleted');
			return true;
		} catch (error) {
			console.error('Error deleting wallet:', error);
			return false;
		}
	}
	
	/**
	 * Get authentication redirect path based on current status
	 */
	static async getRedirectPath(): Promise<string> {
		const authStatus = await this.getAuthStatus();
		
		if (authStatus.isFirstTime) {
			return '/welcome';
		} else if (authStatus.needsSignIn) {
			return '/sign-in';
		} else if (authStatus.isAuthenticated) {
			return '/'; // Main app
		} else {
			// Fallback for edge cases
			return '/welcome';
		}
	}
}

/**
 * Quick utility functions for common auth checks
 */
export const authUtils = {
	getStatus: AuthenticationManager.getAuthStatus,
	storeToken: AuthenticationManager.storeJWTToken,
	logout: AuthenticationManager.logout,
	validateWallet: AuthenticationManager.validateWalletAddress,
	updateWallet: AuthenticationManager.updateWalletAddress,
	deleteWallet: AuthenticationManager.deleteWallet,
	getRedirectPath: AuthenticationManager.getRedirectPath
};
