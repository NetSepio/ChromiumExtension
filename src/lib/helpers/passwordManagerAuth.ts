/**
 * Password Manager Authentication Helper
 * Handles initialization and authentication state for password manager
 * Independent of wallet authentication - uses AuthGuard for route protection
 */

import { PasswordManagerService } from '$lib/services/password-manager-service';

export class PasswordManagerAuth {
	private static service: PasswordManagerService | null = null;
	private static isInitialized = false;

	/**
	 * Initialize password manager service (independent of wallet)
	 */
	static async initializeService(): Promise<{ success: boolean; error?: string }> {
		try {
			// Get service instance
			if (!this.service) {
				this.service = PasswordManagerService.getInstance();
			}

			// Check if already initialized
			if (this.isInitialized && this.service.isServiceInitialized()) {
				return { success: true };
			}

			// Initialize the password manager with independent encryption
			console.log('Initializing password manager with independent encryption...');

			const result = await this.service.initialize();

			if (result.success) {
				this.isInitialized = true;
				console.log('Password manager initialized successfully');
				return { success: true };
			} else {
				return { success: false, error: result.error };
			}
		} catch (error) {
			console.error('Password manager initialization failed:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Get the initialized service instance
	 */
	static getService(): PasswordManagerService | null {
		return this.service;
	}

	/**
	 * Check if service is initialized
	 */
	static isServiceInitialized(): boolean {
		return this.isInitialized && this.service?.isServiceInitialized() === true;
	}

	/**
	 * Reset initialization state (for logout/cleanup)
	 */
	static async reset(): Promise<void> {
		this.isInitialized = false;
		this.service = null;
	}

	/**
	 * Check if password manager is accessible (should be called after AuthGuard check)
	 */
	static async isAccessible(): Promise<{ accessible: boolean; error?: string }> {
		// Initialize service if not already done
		const initResult = await this.initializeService();
		if (!initResult.success) {
			return { accessible: false, error: initResult.error };
		}

		return { accessible: true };
	}

	/**
	 * Quick initialization for password manager usage
	 */
	static async quickInit(): Promise<{ success: boolean; error?: string }> {
		return await this.initializeService();
	}
}
