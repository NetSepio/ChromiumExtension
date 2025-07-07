import { Connection, PublicKey, Keypair, VersionedTransaction } from '@solana/web3.js';
// Note: @solana/spl-token import commented out until package is installed
// import {
// 	getAssociatedTokenAddress,
// 	createAssociatedTokenAccountInstruction
// } from '@solana/spl-token';

export interface SwapQuote {
	inAmount: string;
	outAmount: string;
	otherAmountThreshold: string;
	swapMode: string;
	slippageBps: number;
	platformFee?: {
		amount: string;
		feeBps: number;
	};
	priceImpactPct: string;
	routePlan: Array<{
		swapInfo: {
			ammKey: string;
			label: string;
			inputMint: string;
			outputMint: string;
			inAmount: string;
			outAmount: string;
			feeAmount: string;
			feeMint: string;
		};
		percent: number;
	}>;
}

export interface SwapTransaction {
	transaction: string; // Base64 encoded transaction
	lastValidBlockHeight: number;
}

export interface TokenInfo {
	address: string;
	chainId: number;
	decimals: number;
	name: string;
	symbol: string;
	logoURI?: string;
	verified?: boolean;
}

export class JupiterSwapService {
	private _connection: Connection;
	private baseUrl = 'https://quote-api.jup.ag/v6';

	constructor(rpcUrl: string) {
		this._connection = new Connection(rpcUrl, 'confirmed');
	}

	get connection(): Connection {
		return this._connection;
	}

	/**
	 * Get a quote for swapping tokens
	 */
	async getQuote(
		inputMint: string,
		outputMint: string,
		amount: number,
		slippageBps: number = 50 // 0.5%
	): Promise<SwapQuote> {
		const params = new URLSearchParams({
			inputMint,
			outputMint,
			amount: amount.toString(),
			slippageBps: slippageBps.toString(),
			onlyDirectRoutes: 'false',
			asLegacyTransaction: 'false'
		});

		const response = await fetch(`${this.baseUrl}/quote?${params}`);

		if (!response.ok) {
			throw new Error(`Failed to get quote: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Get swap transaction for execution
	 */
	async getSwapTransaction(
		userPublicKey: string,
		quote: SwapQuote,
		priorityFee?: number
	): Promise<SwapTransaction> {
		const swapRequest = {
			quoteResponse: quote,
			userPublicKey,
			wrapAndUnwrapSol: true,
			useSharedAccounts: true,
			feeAccount: undefined, // Optional fee account
			trackingAccount: undefined, // Optional tracking
			computeUnitPriceMicroLamports: priorityFee || 'auto',
			asLegacyTransaction: false
		};

		const response = await fetch(`${this.baseUrl}/swap`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(swapRequest)
		});

		if (!response.ok) {
			throw new Error(`Failed to get swap transaction: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Execute the swap transaction
	 */
	async executeSwap(swapTransaction: SwapTransaction, userKeypair: Keypair): Promise<string> {
		try {
			// Deserialize the transaction
			const transactionBuf = Buffer.from(swapTransaction.transaction, 'base64');
			const transaction = VersionedTransaction.deserialize(transactionBuf);

			// Sign the transaction
			transaction.sign([userKeypair]);
			// Send and confirm transaction
			const signature = await this._connection.sendTransaction(transaction, {
				skipPreflight: false,
				preflightCommitment: 'confirmed',
				maxRetries: 3
			});

			// Wait for confirmation
			const confirmation = await this._connection.confirmTransaction({
				signature,
				blockhash: (await this._connection.getLatestBlockhash()).blockhash,
				lastValidBlockHeight: swapTransaction.lastValidBlockHeight
			});

			if (confirmation.value.err) {
				throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
			}

			return signature;
		} catch (error) {
			console.error('Swap execution error:', error);
			throw new Error(
				`Swap execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	/**
	 * Get token list from Jupiter
	 */
	async getTokenList(): Promise<TokenInfo[]> {
		const response = await fetch(`${this.baseUrl}/tokens`);

		if (!response.ok) {
			throw new Error(`Failed to get token list: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Check if user has sufficient balance for swap
	 */
	async checkBalance(
		userPublicKey: PublicKey,
		tokenMint: PublicKey,
		requiredAmount: number
	): Promise<boolean> {
		try {
			if (tokenMint.equals(PublicKey.default)) {
				// SOL balance
				const balance = await this._connection.getBalance(userPublicKey);
				return balance >= requiredAmount;
			} else {
				// SPL Token balance - requires @solana/spl-token package
				// const tokenAccount = await getAssociatedTokenAddress(tokenMint, userPublicKey);
				// const accountInfo = await this.connection.getTokenAccountBalance(tokenAccount);
				// return accountInfo.value.uiAmount !== null && accountInfo.value.uiAmount >= requiredAmount;

				// For now, return false until @solana/spl-token is installed
				console.warn('SPL token balance check requires @solana/spl-token package');
				return false;
			}
		} catch (error) {
			console.error('Balance check error:', error);
			return false;
		}
	}

	/**
	 * Create associated token account if it doesn't exist
	 * Note: This method requires @solana/spl-token package
	 */
	async ensureTokenAccount(): Promise<PublicKey> {
		// Note: This functionality requires @solana/spl-token package
		// const associatedTokenAccount = await getAssociatedTokenAddress(tokenMint, userPublicKey);

		// For now, just return a placeholder
		throw new Error('Token account management requires @solana/spl-token package to be installed');

		/*
		const associatedTokenAccount = await getAssociatedTokenAddress(tokenMint, userPublicKey);

		try {
			// Check if account exists
			await this.connection.getTokenAccountBalance(associatedTokenAccount);
			return associatedTokenAccount;
		} catch {
			// Account doesn't exist, create it
			const transaction = new Transaction().add(
				createAssociatedTokenAccountInstruction(
					userPublicKey, // payer
					associatedTokenAccount, // associatedToken
					userPublicKey, // owner
					tokenMint // mint
				)
			);

			const signature = await this.connection.sendTransaction(transaction, [userKeypair]);
			await this.connection.confirmTransaction(signature);

			return associatedTokenAccount;
		}
		*/
	}

	/**
	 * Get transaction fees estimation
	 */
	async estimateFees(transaction: VersionedTransaction): Promise<number> {
		try {
			const fees = await this.connection.getFeeForMessage(transaction.message, 'confirmed');
			return fees.value || 5000; // fallback to 5000 lamports
		} catch (error) {
			console.error('Fee estimation error:', error);
			return 5000; // fallback fee
		}
	}
}

// Common token mints on Solana
export const COMMON_TOKENS = {
	SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
	USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
	USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
	RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
	SRM: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
	ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'
};

export default JupiterSwapService;
