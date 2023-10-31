import { privateKey, publicKey, walletAddress } from '$lib/store/store';
import { ethers } from 'ethers';
import { PUBLIC_JSON_RPC_PROVIDER_URL, PUBLIC_GATEWAY_URL } from '$env/static/public';
import { AptosAccount, Provider, Network, TransactionBuilder } from 'aptos';
import type { AdapterPlugin } from '@aptos-labs/wallet-adapter-core';

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
	const utf8EncodeText = new TextEncoder();

	publicKey.subscribe((val) => {
		pubKey = val;
	});

	privateKey.subscribe((val) => (privKey = val));

	if (privKey !== '') {
		let aptos = new AptosAccount();
		// let signMessage =utf8EncodeText.encode(`${message?.eula}${message?.flowId}`);
		let signMessage = utf8EncodeText.encode(
			`APTOS\nmessage: ${message?.eula}\nnonce: ${message?.flowId}`
		);

		const provider = new Provider(Network.TESTNET);
		console.log(provider);

		// let wallet = await aptos.signingKey(privKey, pubKey);

		const signature = aptos.signBuffer(signMessage);
		return { signature, pubKey };

		// const provider = new ethers.providers.JsonRpcProvider(PUBLIC_JSON_RPC_PROVIDER_URL);
		// const wallet = new ethers.Wallet(privKey, provider);
		// const signature = await wallet.signMessage(`${message?.eula}${message?.flowId}`);
		// return signature;
	}
};
