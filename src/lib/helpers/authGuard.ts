/**
 * Authentication Guard for routing protection
 * Handles user authentication state and redirects appropriately
 */

import { SecureStorage } from './secureStorage';
import { passwordUtils } from './securePasswordManager';
import { getWalletAddress } from '../../store/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export interface AuthState {
	hasWallet: boolean;
	hasValidToken: boolean;
	isAuthenticated: boolean;
	needsRedirect: boolean;
	redirectTo?: string;
}

export class AuthGuard {
	/**
	 * Check the current authentication state
	 */
	static async checkAuthState(): Promise<AuthState> {
		try {
			// Check if wallet exists
			const hasWallet = await SecureStorage.hasWalletData();
			console.log('AuthGuard: Wallet exists:', hasWallet);

			// Check if there's a valid JWT token
			const tokenResult = await SecureStorage.getJWTToken();
			const hasValidToken = tokenResult.success && !!tokenResult.data;
			console.log('AuthGuard: Valid token exists:', hasValidToken);

			// Check if wallet address is available (indicates unlocked wallet)
			const walletAddress = await getWalletAddress();
			const hasWalletAddress = walletAddress && walletAddress !== 'none';
			console.log('AuthGuard: Wallet address available:', hasWalletAddress);

			// Determine authentication state
			const isAuthenticated = hasWallet && hasValidToken && hasWalletAddress;

			// Determine redirect needs
			let needsRedirect = false;
			let redirectTo: string | undefined;

			if (!hasWallet) {
				// No wallet - redirect to welcome page
				needsRedirect = true;
				redirectTo = '/welcome';
			} else if (!hasValidToken || !hasWalletAddress) {
				// Has wallet but no token or wallet locked - redirect to sign-in
				needsRedirect = true;
				redirectTo = '/sign-in';
			}

			return {
				hasWallet,
				hasValidToken,
				isAuthenticated,
				needsRedirect,
				redirectTo
			};
		} catch (error) {
			console.error('AuthGuard.checkAuthState error:', error);
			
			// On error, assume no authentication and redirect to welcome
			return {
				hasWallet: false,
				hasValidToken: false,
				isAuthenticated: false,
				needsRedirect: true,
				redirectTo: '/welcome'
			};
		}
	}

	/**
	 * Protect a route by checking authentication and redirecting if needed
	 */
	static async protectRoute(
		currentPath: string,
		allowedWithoutAuth: string[] = ['/welcome', '/sign-in', '/create-new-wallet', '/import-wallet', '/create-password']
	): Promise<boolean> {
		if (!browser) return true; // Skip protection during SSR

		try {
			const authState = await this.checkAuthState();
			
			// If route is allowed without auth, allow access
			if (allowedWithoutAuth.includes(currentPath)) {
				console.log(`AuthGuard: Route ${currentPath} is allowed without auth`);
				return true;
			}

			// If authenticated, allow access to protected routes
			if (authState.isAuthenticated) {
				console.log(`AuthGuard: User authenticated, allowing access to ${currentPath}`);
				return true;
			}

			// If not authenticated and needs redirect
			if (authState.needsRedirect && authState.redirectTo) {
				console.log(`AuthGuard: Redirecting from ${currentPath} to ${authState.redirectTo}`);
				await goto(authState.redirectTo, { replaceState: true });
				return false;
			}

			return true;
		} catch (error) {
			console.error('AuthGuard.protectRoute error:', error);
			// On error, redirect to welcome page
			await goto('/welcome', { replaceState: true });
			return false;
		}
	}

	/**
	 * Handle homepage routing logic specifically
	 */
	static async handleHomepageRouting(): Promise<void> {
		if (!browser) return; // Skip during SSR

		try {
			const authState = await this.checkAuthState();
			
			console.log('AuthGuard: Homepage routing check:', authState);

			if (authState.needsRedirect && authState.redirectTo) {
				console.log(`AuthGuard: Redirecting homepage to ${authState.redirectTo}`);
				await goto(authState.redirectTo, { replaceState: true });
			} else {
				console.log('AuthGuard: Homepage access allowed');
			}
		} catch (error) {
			console.error('AuthGuard.handleHomepageRouting error:', error);
			// On error, redirect to welcome page
			await goto('/welcome', { replaceState: true });
		}
	}

	/**
	 * Check if user should be redirected away from auth pages when already authenticated
	 */
	static async handleAuthPageRedirect(currentPath: string): Promise<void> {
		if (!browser) return; // Skip during SSR

		try {
			const authPages = ['/welcome', '/sign-in', '/create-new-wallet', '/import-wallet', '/create-password'];
			
			if (!authPages.includes(currentPath)) {
				return; // Not an auth page
			}

			const authState = await this.checkAuthState();
			
			// If user is fully authenticated and on an auth page, redirect to home
			if (authState.isAuthenticated) {
				console.log(`AuthGuard: User authenticated but on auth page ${currentPath}, redirecting to home`);
				await goto('/', { replaceState: true });
				return;
			}

			// Special case: if user is on welcome page but has wallet, redirect to sign-in
			if (currentPath === '/welcome' && authState.hasWallet && !authState.hasValidToken) {
				console.log('AuthGuard: User has wallet but on welcome page, redirecting to sign-in');
				await goto('/sign-in', { replaceState: true });
				return;
			}

			console.log(`AuthGuard: User appropriately on auth page ${currentPath}`);
		} catch (error) {
			console.error('AuthGuard.handleAuthPageRedirect error:', error);
		}
	}

	/**
	 * Logout user and redirect to welcome page
	 */
	static async logout(): Promise<void> {
		try {
			// Clear JWT token
			await SecureStorage.removeJWTToken();
			
			// Lock wallet (clear in-memory data)
			await passwordUtils.lockWallet();
			
			console.log('AuthGuard: User logged out');
			
			// Redirect to welcome page
			await goto('/welcome', { replaceState: true });
		} catch (error) {
			console.error('AuthGuard.logout error:', error);
			// Force redirect to welcome even on error
			await goto('/welcome', { replaceState: true });
		}
	}

	/**
	 * Initialize auth guard (call this in app initialization)
	 */
	static async initialize(): Promise<void> {
		try {
			// Check for legacy storage migration
			const { StorageMigration } = await import('./secureStorage');
			
			if (StorageMigration.hasLegacyData()) {
				console.log('AuthGuard: Migrating legacy storage...');
				const migrationResult = await StorageMigration.migrateLegacyStorage();
				if (migrationResult.success) {
					console.log('AuthGuard: Legacy storage migration completed');
				} else {
					console.error('AuthGuard: Legacy storage migration failed:', migrationResult.error);
				}
			}

			console.log('AuthGuard: Initialized');
		} catch (error) {
			console.error('AuthGuard.initialize error:', error);
		}
	}

	/**
	 * Get current auth state (useful for reactive UI updates)
	 */
	static async getCurrentAuthState(): Promise<AuthState> {
		return await this.checkAuthState();
	}

	/**
	 * Check if token is expired or invalid
	 */
	static async validateJWTToken(): Promise<boolean> {
		try {
			const tokenResult = await SecureStorage.getJWTToken();
			
			if (!tokenResult.success || !tokenResult.data) {
				return false;
			}

			const token = tokenResult.data;

			// Basic JWT structure validation
			const parts = token.split('.');
			if (parts.length !== 3) {
				console.log('AuthGuard: Invalid JWT structure');
				return false;
			}

			// Decode payload to check expiration
			try {
				const payload = JSON.parse(atob(parts[1]));
				const currentTime = Math.floor(Date.now() / 1000);
				
				if (payload.exp && payload.exp < currentTime) {
					console.log('AuthGuard: JWT token expired');
					// Remove expired token
					await SecureStorage.removeJWTToken();
					return false;
				}

				console.log('AuthGuard: JWT token is valid');
				return true;
			} catch (decodeError) {
				console.error('AuthGuard: Failed to decode JWT:', decodeError);
				return false;
			}
		} catch (error) {
			console.error('AuthGuard.validateJWTToken error:', error);
			return false;
		}
	}
}

/**
 * Utility function for route protection (use in page components)
 */
export async function protectPage(currentPath: string): Promise<boolean> {
	return await AuthGuard.protectRoute(currentPath);
}

/**
 * Utility function for homepage routing (use in +page.svelte)
 */
export async function handleHomepageAuth(): Promise<void> {
	return await AuthGuard.handleHomepageRouting();
}

/**
 * Utility function for auth page redirect handling
 */
export async function handleAuthPageAccess(currentPath: string): Promise<void> {
	return await AuthGuard.handleAuthPageRedirect(currentPath);
}
