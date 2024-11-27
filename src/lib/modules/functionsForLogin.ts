// Importing necessary modules and variables
import { privateKey, publicKey, walletAddress } from '$lib/store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';

import { ethers, Wallet } from 'ethers';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { config } from './config';

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
export const sendSignature = async (
	flowId: string,
	walletAddress: string

	// chainName: string,
	// chainType: string
) => {
	// Initializing headers
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	// Creating JSON body with flowId, signature, and publicKey
	let body = JSON.stringify({
		flowId,
		walletAddress
		// chainName: 'sui'
	});

	// Initializing request options
	let requestOptions: RequestInit = {
		method: 'POST',
		headers: myHeaders,
		body,
		redirect: 'follow'
	};

	// Making a fetch request to the public gateway's authentication endpoint
	const data = await fetch(`${PUBLIC_GATEWAY_URL}/authenticate/NonSign`, requestOptions);

	// Returning the parsed JSON response
	return data.json();
};

// Function to sign a message using the private key
export const signWithKey = async (signMessage: any) => {
	// Initializing private and public key variables
	let privKey = '';
	let pubKey = '';

	// Subscribing to the publicKey and privateKey stores to get the public and private keys
	publicKey.subscribe((val) => (pubKey = val));
	privateKey.subscribe((val) => (privKey = val));
	try {
		// Checking if a private key is present
		if (privKey !== '') {
			const message = new TextEncoder().encode(signMessage);
			const keypair = Ed25519Keypair.fromSecretKey(privKey);
			const hexObject = await keypair.sign(message);
			const signature = Object.values(hexObject)
				.map((byte) => byte.toString(16).padStart(2, '0'))
				.join('');

			return { signature, pubKey };
		}
	} catch (error) {
		console.log('error:', error);
	}
	// Returning the signature and public key
};
