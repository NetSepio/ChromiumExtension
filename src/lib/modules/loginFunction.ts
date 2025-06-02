import { walletAddress, privateKey } from '../../store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { ethers } from 'ethers';
import { signBytes, getUtf8Encoder, createKeyPairFromPrivateKeyBytes } from '@solana/kit';
import type { SignatureBytes } from '@solana/kit';

//function to request flowID from the public gateway
export async function askFlowId(chain: string) {
	let address: string = '';
	walletAddress.subscribe((addy) => (address = addy));

	const data = await fetch(`${PUBLIC_GATEWAY_URL}/flowid?walletAddress=${address}&chain=${chain}`);
	return data.json();
}

// Function to send a signature along with the flowId and walletAddress to the server
export async function sendSignature(
	flowId: string,
	walletAddress: string,
	signature: string | undefined | void | SignatureBytes,
	chainName: string
) {
	// Create headers for the request
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	// Prepare the request body as a JSON string
	const body = JSON.stringify({
		flowId,
		walletAddress,
		chainName,
		signature
	});

	// Configure the request options
	const requestOptions: RequestInit = {
		method: 'POST', // HTTP method
		headers: myHeaders, // Headers for the request
		body, // Request body
		redirect: 'follow' // Handle redirects
	};

	// Send the POST request to the server and await the response
	const data = await fetch(`${PUBLIC_GATEWAY_URL}/authenticate/`, requestOptions);

	// Parse and return the response as JSON
	return data.json();
}

// Function to sign a message using the private key
export const signWithKey = async (signMessage: string) => {
	// Initializing private and public key variables
	let privKey = '';

	// Subscribing to the publicKey and privateKey stores to get the public and private keys

	privateKey.subscribe((value) => (privKey = value));
	try {
		// Checking if a private key is present
		if (privKey !== '') {
			const wallet = new ethers.Wallet(privKey);
			const provider = ethers.getDefaultProvider();
			const signer = wallet.connect(provider);
			const signature = await signer.signMessage(signMessage);
			return signature;
		}
	} catch (error) {
		console.log('error:', error);
	}
};

// function to sign a message in sol

export const signWithSolKey = async (signMessage: string) => {
	let privKey = '';

	// Subscribing to the privateKey store to get the private key
	privateKey.subscribe((value) => (privKey = value));

	try {
		// Checking if a private key is present
		if (privKey !== '') {
			const privateKeyBytes = Uint8Array.from(Buffer.from(privKey, 'hex'));
			const signer = await createKeyPairFromPrivateKeyBytes(privateKeyBytes);
			console.log('signer:', signer);
			const message = getUtf8Encoder().encode(signMessage);
			const signature = await signBytes(signer.privateKey, message);
			return signature;
		}
	} catch (error) {
		console.log('error:', error);
	}
};
