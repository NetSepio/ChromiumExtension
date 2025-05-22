import pkg from 'crypto-js';
import { browser } from '$app/environment';
import { mnemonicPhrase as mnemonicPhrase } from '$lib/store/store';


const {AES, enc, lib, SHA256} = pkg;
// Define the structure of the result when encrypting data
interface EncryptionResult {
	encryptedData: string;
	iv: string;
}

// Function to encrypt data with a password
const encrypt = async (password: string): Promise<EncryptionResult> => {
	const mnemonic = await mnemonicPhrase.get();
	const hash = SHA256(mnemonic).toString(enc.Hex);
	localStorage.setItem('mnemonicHash', hash);
	const iv = lib.WordArray.random(16).toString(enc.Hex);
	const encrypted = AES.encrypt(mnemonic, password, { iv: iv }).toString();
	return {
		encryptedData: encrypted,
		iv: iv
	};
};

// Function to decrypt data with a hashed mnemonic, password, and IV
const decrypt = (hashedMnemonic: string, password: string, iv: string): string => {
	const decrypted = AES.decrypt(hashedMnemonic, password, { iv: iv }).toString(enc.Utf8);
	return decrypted;
};

// Function to encrypt a password and store it in localStorage
async function encryptAndStorePassword(newPassword: string): Promise<boolean> {
	const encryptedData = await encrypt(newPassword);
	localStorage.setItem('iv', encryptedData.iv);
	localStorage.setItem('encryptedMnemonic', encryptedData.encryptedData);
	if (localStorage.getItem('encryptedMnemonic')) {
		return true;
	} else {
		return false;
	}
}

// Export the encryptAndStorePassword function
export { encryptAndStorePassword };

// Function to authenticate a user by decrypting the mnemonic
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
		mnemonicPhrase.set(decryptedMnemonicHash);
		return true;
	} else {
		return false;
	}
}

// Export the authenticateUser function
export { authenticateUser };

// Function to check the authentication status
// 0th element represents whether the wallet is locked
// 1st element represents whether the wallet is unlocked by password
export async function checkAuth(): Promise<boolean[]> {
	const decryptedMnemonic = browser && (await mnemonicPhrase.get());
	const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');

	let returnVar = [false, false]; // 0th is encryptedMnemonic, 1st is decryptedMnemonic

	encryptedMnemonic ? (returnVar[0] = true) : (returnVar[0] = false);
	decryptedMnemonic ? (returnVar[1] = true) : (returnVar[1] = false);

	return returnVar;
}
