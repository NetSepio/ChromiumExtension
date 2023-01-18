import { AES, enc, lib } from 'crypto-js';

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
}

const decrypt = (text: string, key: string | null , iv: string): string => {
    const decrypted = AES.decrypt(text, key, { iv: iv }).toString(enc.Utf8);
    return decrypted;
}

function encryptAndStorePassword(newPassword: string) {
    const encryptedData = encrypt(newPassword);
    localStorage.setItem('iv', encryptedData.iv);
    localStorage.setItem('newPassword', encryptedData.encryptedData);
    return true;
}
export { encryptAndStorePassword }

function authenticateUser(userPassword: string): boolean {
    const key = localStorage.getItem('mnemonicPhase');
    const iv = localStorage.getItem('iv');
    if(key === null || iv === null){
        return false;
    }
    const encryptedPassword = localStorage.getItem('newPassword');
    if (encryptedPassword === null) {
        return false;
    }
    const decryptedPassword = decrypt(encryptedPassword, key, iv);
    if (userPassword === decryptedPassword) {
        window.location.href = '/Dashboard';
        return true;
    } else {
        return false;
    }
}
export { authenticateUser }