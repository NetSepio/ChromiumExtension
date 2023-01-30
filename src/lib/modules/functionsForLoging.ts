import { privateKey, walletAddress } from '$lib/store/store';
import { ethers } from 'ethers';
import { PUBLIC_JSON_RPC_PROVIDER_URL } from '$env/static/public';

interface messageType {
	eula: string;
	flowId: string;
}

export const askFlowId = async () => {
	let address: string = '';
	walletAddress.subscribe((u) => (address = u));

	const data = await fetch(`http://localhost:3000/api/v1.0/flowid?walletAddress=${address}`);

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
	const data = await fetch('http://localhost:3000/api/v1.0/authenticate', requestOptions);

	let json = await data.json();

	return json;
};

export const signWithPrivateKey = async (message: messageType) => {
	let key = '';
	privateKey.subscribe((val) => {
		key = val;
	});

	if (key !== '') {
		console.log(`The Key is form store of privatekey ${key}`);
		const provider = new ethers.providers.JsonRpcProvider(PUBLIC_JSON_RPC_PROVIDER_URL);
		const wallet = new ethers.Wallet(key, provider);
		const signature = await wallet.signMessage(`${message?.eula}${message?.flowId}`);
		return signature;
	}
};
