import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// WALLET ADDRESS
const walletAddressStore = () => {
	const { set, subscribe } = writable((browser && localStorage.getItem('walletAddress')) || '');

	subscribe((value) => browser && localStorage.setItem('walletAddress', value));

	const setWalletAddress = (value: string) => {
		browser && localStorage.setItem('walletAddress', value);
		set(value);
	};
	return {
		subscribe,
		setWalletAddress
	};
};
export const walletAddress = walletAddressStore();

// MNEMONIC PHASE OF THE WALLET
const mnemonicPhaseStore = () => {
	const { set, subscribe } = writable((browser && localStorage.getItem('mnemonicPhase')) || '');

	subscribe((value) => browser && localStorage.setItem('mnemonicPhase', value));

	const setMnemonicPhase = (value: string) => {
		browser && localStorage.setItem('mnemonicPhase', value);
		set(value);
	};
	return {
		subscribe,
		setMnemonicPhase
	};
};
export const mnemonicPhase = mnemonicPhaseStore();

// LOGIN JWT TOKEN
const jwtTokenStore = () => {
	const { set, subscribe } = writable((browser && localStorage.getItem('jwtToken')) || '');

	subscribe((value) => browser && localStorage.setItem('jwtToken', value));

	const setJwtToken = (value: string) => {
		browser && localStorage.setItem('jwtToken', value);
		set(value);
	};
	return {
		subscribe,
		setJwtToken
	};
};
export const jwtToken = jwtTokenStore();

// ONBOARDING STEPS THAT IS LEFT FOR THE USER TO COMPLETE
const onboardingStepsLeftStore = () => {
	const { set, update, subscribe } = writable(
		(browser && Number(localStorage.getItem('onboardingStepsLeft'))) || 3
	);

	subscribe((value) => browser && localStorage.setItem('onboardingStepsLeft', value.toString()));

	const setOnboardingStepsLeft = (value: number) => {
		browser && localStorage.setItem('onboardingStepsLeft', value.toString());
		set(value);
	};

	const decreaseOnboardingStepsLeft = () => {
		update((value) => {
			browser && localStorage.setItem('onboardingStepsLeft', (value - 1).toString());
			return value - 1;
		});
	};

	const increaseOnboardingStepsLeft = () => {
		update((value) => {
			browser && localStorage.setItem('onboardingStepsLeft', (value + 1).toString());
			return value + 1;
		});
	};
	return {
		subscribe,
		setOnboardingStepsLeft,
		decreaseOnboardingStepsLeft,
		increaseOnboardingStepsLeft
	};
};
export const onboardingStepsLeft = onboardingStepsLeftStore();
