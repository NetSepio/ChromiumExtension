import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const isReviewSubmitted = writable(false);

// WALLET ADDRESS
export const walletAddress = writable<string>(
	(browser && localStorage.getItem('walletAddress')) || ''
);

walletAddress.subscribe((value) => browser && localStorage.setItem('walletAddress', value));

// WALLET KEYs
export const privateKey = writable((browser && sessionStorage.getItem('privateKey')) || '');
export const publicKey = writable((browser && sessionStorage.getItem('publicKey')) || '');

privateKey.subscribe((value) => browser && sessionStorage.setItem('privateKey', value));
publicKey.subscribe((value) => browser && sessionStorage.setItem('publicKey', value));

// MNEMONIC PHASE OF THE WALLET
// const mnemonicPhraseStore = writable((browser && sessionStorage.getItem('mnemonicPhrase')) || '');

// mnemonicPhraseStore.subscribe((value) => browser && sessionStorage.setItem('mnemonicPhrase', value));

// export const setMnemonicPhrase = (value: string) => {
// 	browser && sessionStorage.setItem('mnemonicPhrase', value);
// 	mnemonicPhraseStore.set(value);
// };

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

export const mnemonicPhrase = {
	get: getMnemonicPhrase,
	set: setMnemonicPhrase,
	remove: removeMnemonicPhrase
};

// LOGIN JWT TOKEN
export const jwtToken = writable<string>((browser && localStorage.getItem('jwtToken')) || '');

jwtToken.subscribe((value) => browser && localStorage.setItem('jwtToken', value));

export const setJwtToken = (value: string) => {
	browser && localStorage.setItem('jwtToken', `${value}`);
	jwtToken.set(value);
};

// ONBOARDING STEPS THAT IS LEFT FOR THE USER TO COMPLETE
const onboardingStepsLeftStore = writable(
	(browser && Number(localStorage.getItem('onboardingStepsLeft'))) || 0
);

onboardingStepsLeftStore.subscribe(
	(value) => browser && localStorage.setItem('onboardingStepsLeft', value)
);

export const setOnboardingStepsLeft = (value: number) => {
	browser && localStorage.setItem('onboardingStepsLeft', `${value}`);
	onboardingStepsLeftStore.set(value);
};

export const decreaseOnboardingStepsLeft = () => {
	onboardingStepsLeftStore.update((value) => {
		browser && localStorage.setItem('onboardingStepsLeft', `${value - 1}`);
		return value - 1;
	});
};

export const increaseOnboardingStepsLeft = () => {
	onboardingStepsLeftStore.update((value) => {
		browser && localStorage.setItem('onboardingStepsLeft', value + 1);
		return value + 1;
	});
};

export const onboardingStepsLeft = {
	subscribe: onboardingStepsLeftStore.subscribe,
	set: setOnboardingStepsLeft,
	decrease: decreaseOnboardingStepsLeft,
	increase: increaseOnboardingStepsLeft
};

// HASHED PASSWORD
// export const hashedPassword = writable((browser && localStorage.getItem('hashedPassword')) || '');

// hashedPassword.subscribe((value) => browser && localStorage.setItem('hashedPassword', value));

// THE IV/SALT OF THE STORED HASH
export const iv = writable<string>((browser && localStorage.getItem('iv')) || '');
iv.subscribe((value) => browser && localStorage.setItem('iv', value));

// THE USER AVATAR
export const avatarStore = writable<string>((browser && localStorage.getItem('avatar')) || '');

avatarStore.subscribe((value) => browser && localStorage.setItem('avatar', value));

const setAvatar = (url: string) => {
	browser && localStorage.setItem('avatar', `${url}`);
	avatarStore.set(url);
};

export const avatar = {
	set: setAvatar,
	subscribe: avatarStore.subscribe
};
