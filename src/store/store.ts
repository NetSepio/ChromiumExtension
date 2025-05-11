import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getData, setData } from '$lib/helpers/timeStamp';
import type { LocationNodeInfo } from '../types/types';

// Current vpn
export const vpnLocation = writable((browser && localStorage.getItem('location')) as string);

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

// Store for the wallet address
export const walletAddress = writable<string>(
	(browser && localStorage.getItem('walletAddress')) || 'none'
);

// Subscribe to walletAddress changes and update localStorage accordingly
walletAddress.subscribe((value) => browser && localStorage.setItem('walletAddress', value));

// Stores for private and public keys
export const privateKey = writable((browser && getData('privateKey')) || '');
export const publicKey = writable((browser && getData('publicKey')) || '');

// Subscribe to key changes and update sessionStorage accordingly
privateKey.subscribe((value) => browser && setData('privateKey', value, 60));
publicKey.subscribe((value) => browser && setData('publicKey', value, 60));

// Stores for mnemonic phrase handling
async function setMnemonicPhrase(value: string): Promise<boolean> {
	try {
		if (browser) {
			setData('mnemonicPhrase', value, 10);
		}
		return true;
	} catch {
		return false;
	}
}

async function getMnemonicPhrase(): Promise<string | undefined> {
	try {
		const result = getData('mnemonicPhrase');
		return result;
	} catch {
		return undefined;
	}
}

async function removeMnemonicPhrase(): Promise<boolean> {
	try {
		localStorage.removeItem('mnemonicPhrase');
		return true;
	} catch {
		return false;
	}
}

// Exported object for mnemonicPhrase operations
export const mnemonicPhrase = {
	get: getMnemonicPhrase,
	set: setMnemonicPhrase,
	remove: removeMnemonicPhrase
};

// Store for JWT token
export const jwtToken = writable<string>((browser && localStorage.getItem('jwtToken')) as string);

// Subscribe to JWT token changes and update localStorage accordingly
// jwtToken.subscribe((value) => browser && localStorage.setItem('jwtToken', value));

// Function to set JWT token and update the store
export const setJwtToken = (value: string) => {
	if (browser) {
		localStorage.setItem('jwtToken', `${value}`);
	}
	jwtToken.set(value);
};

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

// Store for IV/SALT of the stored hash
export const iv = writable<string>((browser && localStorage.getItem('iv')) || '');

// Subscribe to IV changes and update localStorage accordingly
iv.subscribe((value) => browser && localStorage.setItem('iv', value));
