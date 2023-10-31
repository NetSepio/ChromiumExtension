import { privateKey, publicKey, tempSignature, walletAddress } from '$lib/store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { AptosAccount } from 'aptos';
import { Account, Aptos } from '@aptos-labs/ts-sdk';

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

export const sendSignature = async (flowId: string, signature: string, publicKey: string) => {
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	let body = JSON.stringify({
		flowId,
		signature,
		pubKey: publicKey
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
	let privKey = '';
	let pubKey = '';
	let signature = '';

	publicKey.subscribe((val) => {
		pubKey = val;
	});

	privateKey.subscribe((val) => (privKey = val));
	tempSignature.subscribe((val) => (signature = val));

	if (privKey !== '') {
		console.log(signature);
		return { signature, pubKey };
	}
};
