import { AES, enc, lib, SHA256 } from 'crypto-js';
import { browser } from '$app/environment';
import { mnemonicPhase } from '$lib/store/store';

interface EncryptionResult {
	encryptedData: string;
	iv: string;
}

const encrypt = (password: string): EncryptionResult => {
	const mnemonic = mnemonicPhase.get();
	const hash = SHA256(mnemonic).toString(enc.Hex);
	localStorage.setItem('mnemonicHash', hash);
	const iv = lib.WordArray.random(16).toString(enc.Hex);
	const encrypted = AES.encrypt(mnemonic, password, { iv: iv }).toString();
	return {
		encryptedData: encrypted,
		iv: iv
	};
};

const decrypt = (hashedMnemonic: string, password: string, iv: string): string => {
	const decrypted = AES.decrypt(hashedMnemonic, password, { iv: iv }).toString(enc.Utf8);
	return decrypted;
};

function encryptAndStorePassword(newPassword: string): boolean {
	const encryptedData = encrypt(newPassword);
	localStorage.setItem('iv', encryptedData.iv);
	localStorage.setItem('encryptedMnemonic', encryptedData.encryptedData);
	return true;
}
export { encryptAndStorePassword };

function authenticateUser(userPassword: string): boolean {
	const iv = localStorage.getItem('iv');
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
	return decryptedMnemonicHash === originalMnemonicHash;
}
export { authenticateUser };

export function checkAuth(): boolean {
	const encryptedMnemonic = browser && localStorage.getItem('encryptedMnemonic');
	if (encryptedMnemonic === null) {
		return false;
	}
	return true;
}
