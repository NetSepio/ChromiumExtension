/**
 * Extension initialization and setup
 */

import { initializeSecureStorage } from '../lib/modules/storePassword';
import { AuthGuard } from '../lib/helpers/authGuard';

/**
 * Initialize the extension when it loads
 */
export async function initializeExtension(): Promise<void> {
	try {
		console.log('Initializing Netsepio extension...');
		
		// Initialize auth guard first
		await AuthGuard.initialize();
		
		// Initialize secure storage and handle migrations
		await initializeSecureStorage();
		
		console.log('Extension initialization completed');
	} catch (error) {
		console.error('Extension initialization failed:', error);
	}
}

// Auto-initialize when this module is imported
if (typeof window !== 'undefined' && window.chrome?.storage) {
	initializeExtension();
}
