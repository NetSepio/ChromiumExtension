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

// SECURITY IMPROVEMENT: Add wallet address management functions
export const setWalletAddress = async (address: string): Promise<void> => {
	walletAddress.set(address);
	// Store in session storage temporarily for current session
	if (browser) {
		setData('walletAddress', address, 30); // 30 minutes session storage
	}
};

export const getWalletAddress = async (): Promise<string | null> => {
	// Try to get from memory first
	let address: string = '';
	walletAddress.subscribe(value => address = value)();
	
	if (address && address !== 'none') {
		console.log('Wallet address found in memory:', address);
		return address;
	}
	
	// Try to get from session storage
	const sessionAddress = browser ? getData('walletAddress') : null;
	if (sessionAddress && sessionAddress !== 'none') {
		console.log('Wallet address restored from session storage:', sessionAddress);
		walletAddress.set(sessionAddress);
		return sessionAddress;
	}
	
	// Try to get from old localStorage for backward compatibility
	const legacyAddress = browser ? localStorage.getItem('walletAddress') : null;
	if (legacyAddress && legacyAddress !== 'none') {
		console.log('Wallet address found in legacy localStorage:', legacyAddress);
		// Move to session storage
		await setWalletAddress(legacyAddress);
		return legacyAddress;
	}
	
	console.log('No wallet address found in any storage');
	return null;
};

export const clearWalletAddress = (): void => {
	walletAddress.set('none');
	if (browser) {
		// Clear from all storage locations
		localStorage.removeItem('walletAddress');
		// Clear from session storage using our timestamp helper
		localStorage.removeItem('walletAddress_timestamp'); // Clear the timestamped version
	}
};
