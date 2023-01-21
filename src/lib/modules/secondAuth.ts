import { AES, enc, lib } from 'crypto-js';
import { browser } from '$app/environment';

interface EncryptionResult {
	encryptedData: string;
	iv: string;
}

// CREATING A PROXY FOR CHECKING IF IT'S RUNNING IN THE BROWSER OR NOT
// USE THIS SYNTAX TO CREATE A FUNCTION WHICH ONLY NEEDS TO RUN ON THE BROWSER
// const myFunction = new Proxy(()=>{...}, handler); =======
const handler = {
	apply: (target: any, thisArg: any, args: any[]) => {
		if (browser) {
			return target.apply(thisArg, args);
		} else {
			throw new Error('Browser variable is false');
		}
	}
};

const encrypt = new Proxy((text: string): EncryptionResult => {
	const key = localStorage.getItem('mnemonicPhase');
	const iv = lib.WordArray.random(16).toString(enc.Hex);
	const encrypted = AES.encrypt(text, key, { iv: iv }).toString();
	return {
		encryptedData: encrypted,
		iv: iv
	};
}, handler);

const decrypt = (text: string, key: string | null, iv: string): string => {
	const decrypted = AES.decrypt(text, key, { iv: iv }).toString(enc.Utf8);
	return decrypted;
};

const encryptAndStorePassword = new Proxy((newPassword: string) => {
	const encryptedData = encrypt(newPassword);
	localStorage.setItem('iv', encryptedData.iv);
	localStorage.setItem('hashedPassword', encryptedData.encryptedData);
	return true;
}, handler);
export { encryptAndStorePassword };

const authenticateUser = new Proxy((userPassword: string): boolean => {
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
		window.location.href = '/dashboard';
		return true;
	} else {
		return false;
	}
}, handler);
export { authenticateUser };

export const checkAuth = new Proxy((): boolean => {
	const encryptedPassword = localStorage.getItem('hashedPassword');
	if (encryptedPassword === null) {
		return false;
	}
	return true;
}, handler);
