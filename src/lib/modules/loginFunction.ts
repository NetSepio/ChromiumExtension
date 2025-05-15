import { walletAddress, privateKey, publicKey } from '../../store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
// @ts-expect-error i dunno why
import { ethers } from 'ethers';

//function to request flowID from the public gateway
export async function askFlowId() {
	let address: string = '';
	walletAddress.subscribe((addy) => (address = addy));

	const data = await fetch(`${PUBLIC_GATEWAY_URL}/flowid?walletAddress=${address}`);
	return data.json();
}

// Function to send a signature along with the flowId and walletAddress to the server
export async function sendSignature(flowId: string, walletAddress: string) {
	// Create headers for the request
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	// Prepare the request body as a JSON string
	const body = JSON.stringify({
		flowId,
		walletAddress
	});

	// Configure the request options
	const requestOptions: RequestInit = {
		method: 'POST', // HTTP method
		headers: myHeaders, // Headers for the request
		body, // Request body
		redirect: 'follow' // Handle redirects
	};

	// Send the POST request to the server and await the response
	const data = await fetch(`${PUBLIC_GATEWAY_URL}/authenticate/NonSign`, requestOptions);

	// Parse and return the response as JSON
	return data.json();
}

// Function to sign a message using the private key
export const signWithKey = async (signMessage: string) => {
	// Initializing private and public key variables
	let privKey = '';
	let pubKey = '';

	// Subscribing to the publicKey and privateKey stores to get the public and private keys
	publicKey.subscribe((value) => (pubKey = value));
	privateKey.subscribe((value) => (privKey = value));
	try {
		// Checking if a private key is present
		if (privKey !== '') {
			const wallet = new ethers.Wallet(privKey);
			const provider = ethers.getDefaultProvider();
			const signer = wallet.connect(provider);
			const signature = await signer.signMessage(signMessage);
			return { signature, pubKey };
		}
	} catch (error) {
		console.log('error:', error);
	}
};
