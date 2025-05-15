// import { AES, enc, lib, SHA256 } from 'crypto-js';
import { browser } from '$app/environment';
import { mnemonicPhrase, privateKey, publicKey } from '../../store/store';
import { ethers } from 'ethers';

import pkg from 'crypto-js';
const { AES, enc, lib, SHA256 } = pkg;

// Function to encrypt data with a password
const encrypt = async (password: string) => {
	const mnemonic = await mnemonicPhrase.get();
	if (!mnemonic) {
		throw new Error('Mnemonic is undefined');
	}
	const hash = SHA256(mnemonic).toString(enc.Hex);
	localStorage.setItem('mnemonicHash', hash);
	const iv = lib.WordArray.random(16);
	const encrypted = AES.encrypt(mnemonic, password, { iv: iv }).toString();
	return {
		encryptedData: encrypted,
		iv: iv
	};
};

// Function to decrypt data with a hashed mnemonic, password, and IV
const decrypt = (hashedMnemonic: string, password: string, iv: pkg.lib.WordArray): string => {
	const decrypted = AES.decrypt(hashedMnemonic, password, { iv: iv }).toString(enc.Utf8);
	return decrypted;
};

// Function to encrypt a password and store it in localStorage
export async function encryptAndStorePassword(newPassword: string): Promise<boolean> {
	const encryptedData = await encrypt(newPassword);
	localStorage.setItem('iv', encryptedData.iv.toString());
	localStorage.setItem('encryptedMnemonic', encryptedData.encryptedData);
	if (localStorage.getItem('encryptedMnemonic')) {
		return true;
	} else {
		return false;
	}
}

// Function to authenticate a user by decrypting the mnemonic
export function authenticateUser(userPassword: string): boolean {
	console.log('authenticating');

	const ivString = localStorage.getItem('iv') || '';
	const iv = enc.Hex.parse(ivString);
	if (!iv) {
		return false;
	}
	const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
	if (!encryptedMnemonic) {
		return false;
	}
	const decryptedMnemonic = decrypt(encryptedMnemonic, userPassword, iv);
	const originalMnemonicHash = localStorage.getItem('mnemonicHash');
	const decryptedMnemonicHash = SHA256(decryptedMnemonic).toString(enc.Hex);

	if (decryptedMnemonicHash === originalMnemonicHash) {
		const account = ethers.Wallet.fromPhrase(decryptedMnemonic);
		const pubKey = account.publicKey;
		const privKey = account.privateKey;
		publicKey.set(pubKey);
		privateKey.set(privKey);
		mnemonicPhrase.set(decryptedMnemonicHash);
		return true;
	} else {
		return false;
	}
}

// Function to check the authentication status
// 0th element represents whether the wallet is locked
// 1st element represents whether the wallet is unlocked by password
export async function checkAuth(): Promise<boolean[]> {
	const decryptedMnemonic = browser && (await mnemonicPhrase.get());
	const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');

	const returnVar = [false, false]; // 0th is encryptedMnemonic, 1st is decryptedMnemonic

	returnVar[0] = !!encryptedMnemonic;
	returnVar[1] = !!decryptedMnemonic;

	return returnVar;
}
