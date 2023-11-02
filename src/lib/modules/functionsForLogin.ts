import { privateKey, publicKey, walletAddress } from '$lib/store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { AptosAccount } from 'aptos';

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

	publicKey.subscribe((val) => (pubKey = val));
	privateKey.subscribe((val) => (privKey = val));

	function hexToUint8Array(hex: any) {
		const uint8Array = new Uint8Array(hex.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
		return uint8Array;
	}

	let signMessage = new TextEncoder().encode(
		`APTOS\nmessage: ${message?.eula}\nnonce: ${message?.flowId}`
	);

	if (privKey !== '') {
		const newKey = hexToUint8Array(privKey);
		const aptos_account = new AptosAccount(newKey);
		const signature = aptos_account.signBuffer(signMessage).hex();

		return { signature, pubKey };
	}
};
