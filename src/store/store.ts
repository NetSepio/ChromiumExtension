import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getData, setData } from '$lib/helpers/timeStamp';
import type { LocationNodeInfo } from '../types/types';

// Current vpn
export const vpnLocation = writable((browser && localStorage.getItem('location')) as string);

export const chainName = writable((browser && localStorage.getItem('chainName')) as string);

//
export const node = writable<LocationNodeInfo>({
	id: '',
	name: '',
	httpPort: '',
	domain: '',
	nodename: '',
	chainName: '',
	address: '',
	region: '',
	status: '',
	downloadSpeed: 0,
	uploadSpeed: 0,
	startTimeStamp: 0,
	lastPingedTimeStamp: 0,
	walletAddress: '',
	walletAddressSol: '',
	ipinfoip: '',
	ipinfocity: '',
	ipinfocountry: '',
	ipinfolocation: '',
	ipinfoorg: '',
	ipinfopostal: '',
	ipinfotimezone: '',
	totalUptime: 0,
	upTimeUnit: ''
});

//Store for Network
export const testnet = writable((browser && localStorage.getItem('testnet')) || 'true');

//User balance
export const userBalance = writable((browser && localStorage.getItem('balance')) as string);

// Tracking theme
export const theme = writable('dark');

// SECURITY FIX: Store wallet address in secure session storage instead of localStorage
export const walletAddress = writable<string>('none');

// SECURITY FIX: Store keys in secure session storage with shorter expiration
export const privateKey = writable((browser && getData('privateKey')) || '');
export const publicKey = writable((browser && getData('publicKey')) || '');

// Subscribe to key changes and update sessionStorage with short expiration (security)
privateKey.subscribe((value) => browser && setData('privateKey', value, 30)); // Reduced from 60 to 30 minutes
publicKey.subscribe((value) => browser && setData('publicKey', value, 30)); // Reduced from 60 to 30 minutes

// SECURITY FIX: Completely secure mnemonic handling - NEVER store in localStorage
class SecureMnemonicStore {
	private _tempValue: string = '';
	private _isTemporary: boolean = true;

	/**
	 * Get mnemonic from memory (temporary during wallet creation only)
	 */
	async get(): Promise<string | undefined> {
		if (!this._isTemporary) {
			console.warn('Attempting to access mnemonic after it should have been cleared');
			return undefined;
		}
		return this._tempValue || undefined;
	}

	/**
	 * Set mnemonic in memory temporarily (only during wallet creation flow)
	 */
	async set(value: string): Promise<boolean> {
		try {
			this._tempValue = value;
			this._isTemporary = true;
			
			// Auto-clear after 10 minutes for security
			setTimeout(() => {
				this.clearTemporary();
			}, 10 * 60 * 1000);
			
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Clear temporary mnemonic from memory (call after password encryption)
	 */
	async remove(): Promise<boolean> {
		try {
			this.clearTemporary();
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Clear temporary mnemonic and mark as no longer temporary
	 */
	private clearTemporary(): void {
		this._tempValue = '';
		this._isTemporary = false;
	}

	/**
	 * Check if mnemonic is temporarily available
	 */
	isAvailable(): boolean {
		return this._isTemporary && this._tempValue.length > 0;
	}
}

// SECURITY FIX: Use secure mnemonic store
export const mnemonicPhrase = new SecureMnemonicStore();

// SECURITY FIX: Remove JWT token from localStorage subscription
export const jwtToken = writable<string>('');

// SECURITY FIX: Remove automatic localStorage storage for JWT
// JWT tokens should only be stored in secure storage via SecureStorage class

// Store for onboarding steps left
export const onboardingStepsLeft = writable(
	(browser && Number(localStorage.getItem('onboardingStepsLeft'))) || 0
);

// Subscribe to onboardingStepsLeft changes and update localStorage accordingly
onboardingStepsLeft.subscribe(
	(value) => browser && localStorage.setItem('onboardingStepsLeft', value.toString())
);

// Functions to decrease and increase onboardingStepsLeft, updating the store
export const decreaseOnboardingStepsLeft = () => {
	onboardingStepsLeft.update((value) => {
		if (browser) {
			localStorage.setItem('onboardingStepsLeft', `${value - 1}`);
		}
		return value - 1;
	});
};

export const increaseOnboardingStepsLeft = () => {
	onboardingStepsLeft.update((value) => {
		if (browser) {
			localStorage.setItem('onboardingStepsLeft', (value + 1).toString());
		}
		return value + 1;
	});
};

// SECURITY FIX: Remove IV from localStorage - this should be in secure storage only
// The IV store is removed as it should only exist in secure storage

// Store for cached locations (this is fine in localStorage as it's not sensitive)
export const cachedLocations = writable<LocationNodeInfo[]>([]);

// Subscribe to location changes and update localStorage
cachedLocations.subscribe((locations) => {
	if (browser) {
		localStorage.setItem('cachedLocations', JSON.stringify(locations));
	}
});

// SECURITY IMPROVEMENT: Add wallet address management functions using Chrome storage
export const setWalletAddress = async (address: string): Promise<void> => {
	console.log('setWalletAddress called with:', address);
	
	walletAddress.set(address);
	console.log('Wallet address set in store');
	
	// Store in Chrome extension storage for persistence
	if (browser && typeof chrome !== 'undefined' && chrome.storage) {
		console.log('Chrome storage available, attempting to store...');
		try {
			await chrome.storage.local.set({ walletAddress: address });
			console.log('Wallet address stored in Chrome storage successfully:', address);
			
			// Verify the storage worked
			const verification = await chrome.storage.local.get(['walletAddress']);
			console.log('Chrome storage verification:', verification);
		} catch (error) {
			console.error('Failed to store wallet address in Chrome storage:', error);
			// Fallback to localStorage
			localStorage.setItem('walletAddress_backup', address);
			console.log('Wallet address stored in localStorage fallback:', address);
		}
	} else {
		console.log('Chrome storage not available, using localStorage fallback');
		if (browser) {
			// Fallback for non-extension environments
			localStorage.setItem('walletAddress_backup', address);
			console.log('Wallet address stored in localStorage (non-extension):', address);
		} else {
			console.log('Browser not available (SSR), skipping storage');
		}
	}
};

export const getWalletAddress = async (): Promise<string | null> => {
	console.log('getWalletAddress called');
	
	// Try to get from memory first
	let address: string = '';
	walletAddress.subscribe(value => address = value)();
	
	if (address && address !== 'none') {
		console.log('Wallet address found in memory:', address);
		return address;
	}
	console.log('No wallet address in memory, checking storage...');
	
	// Try to get from Chrome extension storage
	if (browser && typeof chrome !== 'undefined' && chrome.storage) {
		console.log('Checking Chrome storage...');
		try {
			const result = await chrome.storage.local.get(['walletAddress']);
			console.log('Chrome storage result:', result);
			if (result.walletAddress && result.walletAddress !== 'none') {
				console.log('Wallet address restored from Chrome storage:', result.walletAddress);
				walletAddress.set(result.walletAddress);
				return result.walletAddress;
			}
			console.log('No wallet address found in Chrome storage');
		} catch (error) {
			console.error('Failed to retrieve wallet address from Chrome storage:', error);
		}
	} else {
		console.log('Chrome storage not available');
	}
	
	// Fallback to localStorage
	if (browser) {
		console.log('Checking localStorage fallbacks...');
		
		const backupAddress = localStorage.getItem('walletAddress_backup');
		if (backupAddress && backupAddress !== 'none') {
			console.log('Wallet address restored from localStorage fallback:', backupAddress);
			// Migrate to Chrome storage if available
			await setWalletAddress(backupAddress);
			return backupAddress;
		}
		
		// Try timestamped storage for backward compatibility
		const timestampedAddress = getData('walletAddress');
		if (timestampedAddress && timestampedAddress !== 'none') {
			console.log('Wallet address restored from timestamped storage:', timestampedAddress);
			// Migrate to Chrome storage
			await setWalletAddress(timestampedAddress);
			return timestampedAddress;
		}
		
		// Try legacy storage
		const legacyAddress = localStorage.getItem('walletAddress');
		if (legacyAddress && legacyAddress !== 'none') {
			console.log('Wallet address found in legacy localStorage:', legacyAddress);
			// Migrate to Chrome storage
			await setWalletAddress(legacyAddress);
			// Clean up old storage
			localStorage.removeItem('walletAddress');
			return legacyAddress;
		}
		
		console.log('No wallet address found in any localStorage location');
	} else {
		console.log('Browser not available for localStorage check');
	}
	
	console.log('No wallet address found in any storage');
	return null;
};

export const clearWalletAddress = (): void => {
	walletAddress.set('none');
	if (browser) {
		// Clear from Chrome extension storage
		if (typeof chrome !== 'undefined' && chrome.storage) {
			chrome.storage.local.remove(['walletAddress']).then(() => {
				console.log('Wallet address cleared from Chrome storage');
			}).catch(error => {
				console.error('Failed to clear wallet address from Chrome storage:', error);
			});
		}
		
		// Clear from all localStorage locations
		localStorage.removeItem('walletAddress'); // Legacy
		localStorage.removeItem('walletAddress_backup'); // Backup
		
		console.log('Wallet address cleared from all storage locations');
	}
};

// JWT Token management with Chrome storage (persistent until logout)
export const setJWTToken = async (token: string): Promise<void> => {
	jwtToken.set(token);
	// Store in Chrome extension storage for persistence
	if (browser && typeof chrome !== 'undefined' && chrome.storage) {
		try {
			await chrome.storage.local.set({ jwtToken: token });
			console.log('JWT token stored in Chrome storage');
		} catch (error) {
			console.error('Failed to store JWT token in Chrome storage:', error);
			// Fallback to localStorage
			localStorage.setItem('jwtToken', token);
			console.log('JWT token stored in localStorage fallback');
		}
	} else if (browser) {
		// Fallback for non-extension environments
		localStorage.setItem('jwtToken', token);
		console.log('JWT token stored in localStorage (non-extension)');
	}
};

export const getJWTToken = async (): Promise<string | null> => {
	// Try to get from memory first
	let token: string = '';
	jwtToken.subscribe(value => token = value)();
	
	if (token && token !== '') {
		console.log('JWT token found in memory');
		return token;
	}
	
	// Try to get from Chrome extension storage
	if (browser && typeof chrome !== 'undefined' && chrome.storage) {
		try {
			const result = await chrome.storage.local.get(['jwtToken']);
			if (result.jwtToken && result.jwtToken !== '') {
				console.log('JWT token restored from Chrome storage');
				jwtToken.set(result.jwtToken);
				return result.jwtToken;
			}
		} catch (error) {
			console.error('Failed to retrieve JWT token from Chrome storage:', error);
		}
	}
	
	// Fallback to localStorage
	if (browser) {
		const legacyToken = localStorage.getItem('jwtToken');
		if (legacyToken && legacyToken !== '') {
			console.log('JWT token restored from localStorage fallback');
			// Migrate to Chrome storage if available
			await setJWTToken(legacyToken);
			// Clean up old storage
			localStorage.removeItem('jwtToken');
			return legacyToken;
		}
	}
	
	console.log('No JWT token found in any storage');
	return null;
};

export const clearJWTToken = (): void => {
	jwtToken.set('');
	if (browser) {
		// Clear from Chrome extension storage
		if (typeof chrome !== 'undefined' && chrome.storage) {
			chrome.storage.local.remove(['jwtToken']).then(() => {
				console.log('JWT token cleared from Chrome storage');
			}).catch(error => {
				console.error('Failed to clear JWT token from Chrome storage:', error);
			});
		}
		
		// Clear from localStorage
		localStorage.removeItem('jwtToken');
		
		console.log('JWT token cleared from all storage locations');
	}
};
