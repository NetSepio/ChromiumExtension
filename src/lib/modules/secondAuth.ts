import { AES, enc, lib } from 'crypto-js';
import { browser } from '$app/environment';
import { hashedPassword } from '$lib/store/store';

interface EncryptionResult {
	encryptedData: string;
	iv: string;
}

const encrypt = (text: string): EncryptionResult => {
	const key = localStorage.getItem('mnemonicPhase');
	const iv = lib.WordArray.random(16).toString(enc.Hex);
	const encrypted = AES.encrypt(text, key, { iv: iv }).toString();
	return {
		encryptedData: encrypted,
		iv: iv
	};
};

const decrypt = (text: string, key: string | null, iv: string): string => {
	const decrypted = AES.decrypt(text, key, { iv: iv }).toString(enc.Utf8);
	return decrypted;
};

const encryptAndStorePassword = (newPassword: string) => {
	const encryptedData = encrypt(newPassword);
	localStorage.setItem('iv', encryptedData.iv);
	localStorage.setItem('hashedPassword', encryptedData.encryptedData);
	return true;
};
export { encryptAndStorePassword };

const authenticateUser = (userPassword: string): boolean => {
	const key = localStorage.getItem('mnemonicPhase');
	const iv = localStorage.getItem('iv');
	if (key === null || iv === null) {
		return false;
	}
	const encryptedPassword = localStorage.getItem('hashedPassword');
	if (encryptedPassword === null) {
		return false;
	}
	const decryptedPassword = decrypt(encryptedPassword, key, iv);
	if (userPassword === decryptedPassword) {
		window.location.href = '/';
		return true;
	} else {
		return false;
	}
};
export { authenticateUser };

export const checkAuth = (): boolean => {
	const encryptedPassword = hashedPassword.get();
	if (encryptedPassword === null) {
		return false;
	}
	return true;
};
