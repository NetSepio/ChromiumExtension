import { AES, enc, lib } from 'crypto-js';
import { hashedPassword, iv, mnemonicPhase } from '$lib/store/store';

interface EncryptionResult {
	encryptedData: string;
	iv: string;
}

const encrypt = (text: string): EncryptionResult => {
	let key = '';
	mnemonicPhase.subscribe((val) => (key = val));
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
	iv.set(encryptedData.iv);
	hashedPassword.set(encryptedData.encryptedData);
	console.log(`hash ${encryptedData}, salt ${encryptedData.iv}`);

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
	let encryptedPassword = '';
	hashedPassword.subscribe((u) => (encryptedPassword = u));
	if (encryptedPassword === null || encryptedPassword === '') {
		return false;
	}
	return true;
};
