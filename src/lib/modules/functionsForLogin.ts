import { privateKey, publicKey, walletAddress } from '$lib/store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { AptosAccount } from 'aptos';

interface messageType {
	eula: string;
	flowId: string;
}

export const askFlowId = async () => {
	let address: string = '0xc06d2b7284f677b5b631473c99b1a293b9f14e11b3e02a14f6b57d4b2a015c93';
	// walletAddress.subscribe((u) => (address = u));

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
	let privKey = '0xc06d2b7284f677b5b631473c99b1a293b9f14e11b3e02a14f6b57d4b2a015c93';
	let pubKey = '0xb24b73ec64a14b3c2a41c9de9233ac8ffc453d120e5be4a6bcdfbbc6a553da01';

	// publicKey.subscribe((val) => {
	// 	pubKey = val;
	// });

	// privateKey.subscribe((val) => (privKey = val));

	function hexToUint8Array(hex: any) {
		const uint8Array = new Uint8Array(hex.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
		return uint8Array;
	}

	// const codeMessage = new TextEncoder().encode(`${message.eula}${message.flowId}`);

	// const codeMessage = new TextEncoder().encode(
	// 	'APTOS\nmessage: NOT IMPLEMENTED AUTH EULA\nnonce: 1_ae_2343'
	// );
	let signMessage = new TextEncoder().encode(
		`APTOS\nmessage: ${message?.eula}\nnonce: ${message?.flowId}`
	);

	if (privKey !== '') {
		// const pv = 'b660d9dbe1c71bd585d424b16283881238185f4a193b3856457ab8c4d6b70c08';
		const newKey = hexToUint8Array(privKey);
		const aptos_account = new AptosAccount(newKey);
		console.log(aptos_account);

		const signature = aptos_account.signBuffer(signMessage);

		console.log(signature);

		// return { signature, pubKey };
	}
};
