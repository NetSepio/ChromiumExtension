import { privateKey, getWalletAddress } from '../../store/store';
import { PUBLIC_GATEWAY_URL } from '$env/static/public';
import { ethers } from 'ethers';
import { signBytes, getUtf8Encoder, createKeyPairFromPrivateKeyBytes } from '@solana/kit';
import type { SignatureBytes } from '@solana/kit';
import { Buffer } from 'buffer/';

// Enhanced response validation helper
async function handleApiResponse(response: Response) {
	try {
		// Check if response is ok
		if (!response.ok) {
			console.error('API Response not ok:', response.status, response.statusText);

			// Try to get error message from response
			const contentType = response.headers.get('content-type');
			let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

			if (contentType && contentType.includes('application/json')) {
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorData.error || errorMessage;
				} catch (jsonError: unknown) {
					const jsonErrorMessage =
						jsonError instanceof Error ? jsonError.message : String(jsonError);
					console.warn('Failed to parse error response as JSON:', jsonErrorMessage);
				}
			} else {
				// Try to read as text for non-JSON error responses
				try {
					const errorText = await response.text();
					if (errorText) {
						errorMessage = errorText;
					}
				} catch (textError: unknown) {
					const textErrorMessage =
						textError instanceof Error ? textError.message : String(textError);
					console.warn('Failed to read error response as text:', textErrorMessage);
				}
			}

			throw new Error(errorMessage);
		}

		// Check if response has content
		const contentLength = response.headers.get('content-length');
		if (contentLength === '0') {
			throw new Error('Server returned empty response');
		}

		// Check content type
		const contentType = response.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			console.warn('Response is not JSON:', contentType);
			const text = await response.text();
			throw new Error(
				`Expected JSON response but got: ${contentType}. Response: ${text.substring(0, 200)}`
			);
		}

		// Clone response to handle potential multiple reads
		const responseClone = response.clone();
		const text = await responseClone.text();

		if (!text || text.trim() === '') {
			throw new Error('Response body is empty');
		}

		// Parse JSON safely
		try {
			return JSON.parse(text);
		} catch (parseError: unknown) {
			console.error('JSON parse error:', parseError);
			const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
			console.error('Response text:', text.substring(0, 500));
			throw new Error(`Invalid JSON response: ${errorMessage}`);
		}
	} catch (error: unknown) {
		console.error('handleApiResponse error:', error);
		throw error;
	}
}

//function to request flowID from the public gateway
export async function askFlowId() {
	try {
		// Get wallet address securely
		const address = await getWalletAddress();

		if (!address || address === 'none') {
			throw new Error('Wallet address not available');
		}

		console.log('Requesting flowId for address:', address);

		const url = `${PUBLIC_GATEWAY_URL}/flowid?walletAddress=${address}&chain=sol`;
		console.log('FlowId request URL:', url);

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		const data = await handleApiResponse(response);
		console.log('FlowId response:', data);

		return data;
	} catch (error: unknown) {
		console.error('askFlowId error:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to get flow ID: ${errorMessage}`);
	}
}

// Function to send a signature along with the flowId and walletAddress to the server
export async function sendSignature(
	flowId: string,
	walletAddress: string,
	signature: string | undefined | void | SignatureBytes,
	message: string
) {
	try {
		if (!flowId) {
			throw new Error('Flow ID is required');
		}

		if (!walletAddress) {
			throw new Error('Wallet address is required');
		}

		if (!signature) {
			throw new Error('Signature is required');
		}

		if (!message) {
			throw new Error('Message is required');
		}

		const chainName = 'sol';

		// Prepare the request body
		const requestBody = {
			flowId,
			signature,
			pubKey: walletAddress,
			walletAddress,
			message,
			chainName
		};

		console.log('Authentication request body:', {
			...requestBody,
			signature: `${signature.toString().substring(0, 20)}...` // Log truncated signature for security
		});

		const url = `${PUBLIC_GATEWAY_URL}/authenticate?walletAddress=${walletAddress}&chain=sol`;
		console.log('Authentication request URL:', url);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		const data = await handleApiResponse(response);
		console.log('Authentication response:', {
			status: data.status,
			message: data.message,
			hasToken: !!data.payload?.token
		});

		return data;
	} catch (error: unknown) {
		console.error('sendSignature error:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Error(`Authentication failed: ${errorMessage}`);
	}
}

// Function to sign a message using the private key
export const signWithKey = async (signMessage: string) => {
	// Initializing private and public key variables
	let privKey = '';

	// Subscribing to the publicKey and privateKey stores to get the public and private keys
	privateKey.subscribe((value) => (privKey = value))();

	try {
		// Checking if a private key is present
		if (privKey !== '') {
			const wallet = new ethers.Wallet(privKey);
			const provider = ethers.getDefaultProvider();
			const signer = wallet.connect(provider);
			const signature = await signer.signMessage(signMessage);
			return signature.slice(2);
		} else {
			throw new Error('Private key not available');
		}
	} catch (error: unknown) {
		console.error('signWithKey error:', error);
		throw error;
	}
};

// function to sign a message in sol
export const signWithSolKey = async (signMessage: string) => {
	try {
		let privKey = '';

		// Subscribing to the privateKey store to get the private key
		privateKey.subscribe((value) => (privKey = value))();

		if (!privKey || privKey === '') {
			throw new Error('Private key not available - user may need to sign in again');
		}

		console.log('Signing message with Solana key...');

		const privateKeyBytes = Uint8Array.from(Buffer.from(privKey, 'hex'));
		const signer = await createKeyPairFromPrivateKeyBytes(privateKeyBytes);

		const message = getUtf8Encoder().encode(signMessage);
		const signature = await signBytes(signer.privateKey, message);

		const hexSignature = Buffer.from(signature).toString('hex');
		console.log('Message signed successfully');

		return hexSignature;
	} catch (error: unknown) {
		console.error('signWithSolKey error:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to sign message: ${errorMessage}`);
	}
};
