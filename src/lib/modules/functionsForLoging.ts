import { privateKey, publicKey, walletAddress } from '$lib/store/store';
import { ethers } from 'ethers';
import { PUBLIC_JSON_RPC_PROVIDER_URL, PUBLIC_GATEWAY_URL } from '$env/static/public';
import { Account, AccountAddress, Aptos, PrivateKey, PublicKey } from '@aptos-labs/ts-sdk';

interface messageType {
	eula: string;
	flowId: string;
}

export const askFlowId = async () => {
	let address: string = '';
	walletAddress.subscribe((u) => (address = u));

	const data = await fetch(`${PUBLIC_GATEWAY_URL}/flowid?walletAddress=${address}`);

	return data.json();
};

export const sendSignature = async (flowId: string, signature: string) => {
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	let body = JSON.stringify({
		flowId,
		signature
	});

	let requestOptions: RequestInit = {
		method: 'POST',
		headers: myHeaders,
		body,
		redirect: 'follow'
	};
	const data = await fetch(`${PUBLIC_GATEWAY_URL}/authenticate`, requestOptions);

	let json = await data.json();

	return json;
};

export const signWithKey = async (message: messageType) => {
	let key = '';
	publicKey.subscribe((val) => {
		key = val;
	});

	if (key !== '') {
		// const account = Account.authKey(key);
		// const signature = account.verifySignature();
		// const account = await aptos.deriveAccountFromPrivateKey({ privateKey: `${key}` });
		// const provider = new ethers.providers.JsonRpcProvider(PUBLIC_JSON_RPC_PROVIDER_URL);
		// const wallet = new ethers.Wallet(key, provider);
		// const signature = account.verifySignature({ message, signature });
		// await wallet.signMessage(`${message?.eula}${message?.flowId}`);
		// return signature;
	}
};
