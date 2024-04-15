import { writable } from 'svelte/store';
import { browser } from '$app/environment';



//User Balance
// let userB = chrome.storage.local.get()
export const userBalance = writable((browser && localStorage.getItem('balance',)) as string)

//Store for Network
export const testnet = writable((browser && localStorage.getItem('testnet'))||"true")
// testnet.subscribe((value) => browser && localStorage.setItem('walletAddress', value));

//Store for url mappings
export const urlMap = writable({})

// Store for tracking whether a review has been submitted
export const isReviewSubmitted = writable(false);
// Store for tracking theme a review has been submitted
export const darktheme = writable(!false)

// Store for the wallet address
export const walletAddress = writable<string>(
	(browser && localStorage.getItem('walletAddress')) as string
);

// Subscribe to walletAddress changes and update localStorage accordingly
walletAddress.subscribe((value) => browser && localStorage.setItem('walletAddress', value));

// Stores for private and public keys
export const privateKey = writable((browser && sessionStorage.getItem('privateKey')) || '');
export const publicKey = writable((browser && sessionStorage.getItem('publicKey')) || '');

// Subscribe to key changes and update sessionStorage accordingly
privateKey.subscribe((value) => browser && sessionStorage.setItem('privateKey', value));
publicKey.subscribe((value) => browser && sessionStorage.setItem('publicKey', value));

// Stores for mnemonic phrase handling
async function setMnemonicPhrase(value: string): Promise<boolean> {
	try {
		browser && sessionStorage.setItem('mnemonicPhrase', value);
		return true;
	} catch (error) {
		return false;
	}
}

async function getMnemonicPhrase(): Promise<any> {
	try {
		const result = sessionStorage.getItem('mnemonicPhrase');
		return result;
	} catch (error) {
		return undefined;
	}
}

async function removeMnemonicPhrase(): Promise<boolean> {
	try {
		sessionStorage.removeItem('mnemonicPhrase');
		return true;
	} catch (error) {
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
	browser && localStorage.setItem('jwtToken', `${value}`);
	jwtToken.set(value);
};

// Store for onboarding steps left
const onboardingStepsLeftStore = writable(
	(browser && Number(localStorage.getItem('onboardingStepsLeft'))) || 0
);

// Subscribe to onboardingStepsLeft changes and update localStorage accordingly
onboardingStepsLeftStore.subscribe(
	(value) => browser && localStorage.setItem('onboardingStepsLeft', value.toString())
);

// Function to set onboardingStepsLeft and update the store
export const setOnboardingStepsLeft = (value: number) => {
	browser && localStorage.setItem('onboardingStepsLeft', `${value}`);
	onboardingStepsLeftStore.set(value);
};

// Functions to decrease and increase onboardingStepsLeft, updating the store
export const decreaseOnboardingStepsLeft = () => {
	onboardingStepsLeftStore.update((value) => {
		browser && localStorage.setItem('onboardingStepsLeft', `${value - 1}`);
		return value - 1;
	});
};

export const increaseOnboardingStepsLeft = () => {
	onboardingStepsLeftStore.update((value) => {
		browser && localStorage.setItem('onboardingStepsLeft', (value + 1).toString());
		return value + 1;
	});
};

// Exported object for onboardingStepsLeft operations
export const onboardingStepsLeft = {
	subscribe: onboardingStepsLeftStore.subscribe,
	set: setOnboardingStepsLeft,
	decrease: decreaseOnboardingStepsLeft,
	increase: increaseOnboardingStepsLeft
};

// Store for IV/SALT of the stored hash
export const iv = writable<string>((browser && localStorage.getItem('iv')) || '');

// Subscribe to IV changes and update localStorage accordingly
iv.subscribe((value) => browser && localStorage.setItem('iv', value));

// Store for the user avatar
export const avatarStore = writable<string>((browser && localStorage.getItem('avatar')) || '');

// Subscribe to avatar changes and update localStorage accordingly
avatarStore.subscribe((value) => browser && localStorage.setItem('avatar', value));

// Function to set avatar URL and update the store
const setAvatar = (url: string) => {
	browser && localStorage.setItem('avatar', `${url}`);
	avatarStore.set(url);
};

// Exported object for avatar operations
export const avatar = {
	set: setAvatar,
	subscribe: avatarStore.subscribe
};
