import { AES, enc, lib, SHA256 } from 'crypto-js';
import { browser } from '$app/environment';
import { mnemonicPhase } from '$lib/store/store';

interface EncryptionResult {
	encryptedData: string;
	iv: string;
}

const encrypt = async (password: string): Promise<EncryptionResult> => {
	const mnemonic = await mnemonicPhase.get();
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

async function encryptAndStorePassword(newPassword: string): Promise<boolean> {
	const encryptedData = await encrypt(newPassword);
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
	if (decryptedMnemonicHash === originalMnemonicHash) {
		mnemonicPhase.set(decryptedMnemonic);
		return true;
	} else {
		return false;
	}
}
export { authenticateUser };

export function checkAuth(): boolean {
	const decryptedMnemonic = browser && mnemonicPhase.get();
	const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
	console.log(decryptedMnemonic);
	console.log(encryptedMnemonic);

	if (
		decryptedMnemonic === null ||
		decryptedMnemonic === '' ||
		encryptedMnemonic === null ||
		encryptedMnemonic === ''
	) {
		return false;
	}
	return true;
}
