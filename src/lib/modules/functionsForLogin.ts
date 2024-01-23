// Importing necessary modules and variables
import { privateKey, publicKey, walletAddress } from '$lib/store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { AptosAccount } from 'aptos';

// Defining the message type expected by the signWithKey function
interface messageType {
	eula: string;
	flowId: string;
}

// Function to request and retrieve a flow ID from the public gateway
export const askFlowId = async () => {
	// Initializing address variable
	let address: string = '';

	// Subscribing to the walletAddress store to get the user's wallet address
	walletAddress.subscribe((u) => (address = u));

	// Making a fetch request to the public gateway to obtain the flow ID
	const data = await fetch(`${PUBLIC_GATEWAY_URL}/flowid?walletAddress=${address}`);

	// Returning the parsed JSON data
	return data.json();
};

// Function to send signature, flow ID, and public key for authentication
export const sendSignature = async (flowId: string, signature: string, publicKey: string) => {
	// Initializing headers
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	// Creating JSON body with flowId, signature, and publicKey
	let body = JSON.stringify({
		flowId,
		signature,
		pubKey: publicKey
	});

	// Initializing request options
	let requestOptions: RequestInit = {
		method: 'POST',
		headers: myHeaders,
		body,
		redirect: 'follow'
	};

	// Making a fetch request to the public gateway's authentication endpoint
	const data = await fetch(`${PUBLIC_GATEWAY_URL}/authenticate`, requestOptions);

	// Returning the parsed JSON response
	return data.json();
};

// Function to sign a message using the private key
export const signWithKey = async (message: messageType) => {
	// Initializing private and public key variables
	let privKey = '';
	let pubKey = '';

	// Subscribing to the publicKey and privateKey stores to get the public and private keys
	publicKey.subscribe((val) => (pubKey = val));
	privateKey.subscribe((val) => (privKey = val));

	// Helper function to convert a hex string to a Uint8Array
	function hexToUint8Array(hex: any) {
		const uint8Array = new Uint8Array(hex.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
		return uint8Array;
	}

	// Encoding the message
	let signMessage = new TextEncoder().encode(
		`APTOS\nmessage: ${message?.eula}\nnonce: ${message?.flowId}`
	);

	// Checking if a private key is present
	if (privKey !== '') {
		// Creating an AptosAccount instance and signing the message
		const newKey = hexToUint8Array(privKey);
		const aptos_account = new AptosAccount(newKey);
		const signature = aptos_account.signBuffer(signMessage).hex();

		// Returning the signature and public key
		return { signature, pubKey };
	}
};
