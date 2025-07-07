import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
	LAMPORTS_PER_SOL,
	sendAndConfirmTransaction,
	Keypair
} from '@solana/web3.js';
import type { ParsedAccountData } from '@solana/web3.js';

export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

export interface NetworkConfig {
	name: string;
	rpcUrls: string[];
	explorerUrl: string;
}

// Network configurations
export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
	mainnet: {
		name: 'Mainnet',
		rpcUrls: [
			'https://api.mainnet-beta.solana.com',
			'https://rpc.ankr.com/solana',
			'https://solana-mainnet.g.alchemy.com/v2/demo',
			'https://mainnet.helius-rpc.com/?api-key=public',
			'https://solana-api.projectserum.com',
			'https://api.metaplex.solana.com'
		],
		explorerUrl: 'https://explorer.solana.com'
	},
	testnet: {
		name: 'Testnet',
		rpcUrls: [
			'https://api.testnet.solana.com',
			'https://rpc.ankr.com/solana_testnet',
			'https://testnet.helius-rpc.com/?api-key=public',
			'https://testnet.solana.com'
		],
		explorerUrl: 'https://explorer.solana.com?cluster=testnet'
	},
	devnet: {
		name: 'Devnet',
		rpcUrls: [
			'https://api.devnet.solana.com',
			'https://rpc.ankr.com/solana_devnet',
			'https://devnet.helius-rpc.com/?api-key=public',
			'https://devnet.solana.com'
		],
		explorerUrl: 'https://explorer.solana.com?cluster=devnet'
	}
};

export interface TransactionResult {
	success: boolean;
	signature?: string;
	error?: string;
}

export interface TokenInfo {
	mint: string;
	amount: number;
	decimals: number;
	symbol?: string;
	name?: string;
	logoUri?: string;
}

export interface TransactionHistory {
	signature: string;
	timestamp: number;
	type: 'send' | 'receive' | 'swap' | 'other';
	amount: number;
	token: string;
	status: 'confirmed' | 'pending' | 'failed';
	from?: string;
	to?: string;
	fee?: number;
	explorerUrl?: string;
}

export class SolanaWalletService {
	private connection: Connection;
	private networkType: NetworkType;
	private currentRpcIndex: number = 0;

	constructor(networkType: NetworkType = 'mainnet') {
		this.networkType = networkType;
		this.currentRpcIndex = 0;
		this.connection = new Connection(this.getCurrentRpcUrl(), 'confirmed');
	}

	/**
	 * Get current RPC URL for the network
	 */
	private getCurrentRpcUrl(): string {
		const config = NETWORK_CONFIGS[this.networkType];
		return config.rpcUrls[this.currentRpcIndex] || config.rpcUrls[0];
	}

	/**
	 * Switch to next RPC endpoint (for rate limiting fallback)
	 */
	private switchToNextRpc(): boolean {
		const config = NETWORK_CONFIGS[this.networkType];
		if (this.currentRpcIndex < config.rpcUrls.length - 1) {
			this.currentRpcIndex++;
			this.connection = new Connection(this.getCurrentRpcUrl(), 'confirmed');
			return true;
		}
		return false;
	}

	/**
	 * Reset RPC to first endpoint
	 */
	private resetRpc(): void {
		this.currentRpcIndex = 0;
		this.connection = new Connection(this.getCurrentRpcUrl(), 'confirmed');
	}

	/**
	 * Change network type
	 */
	switchNetwork(networkType: NetworkType): void {
		this.networkType = networkType;
		this.resetRpc();
	}

	/**
	 * Get current network configuration
	 */
	getNetworkConfig(): NetworkConfig {
		return NETWORK_CONFIGS[this.networkType];
	}

	/**
	 * Get explorer URL for a transaction
	 */
	getExplorerUrl(signature: string): string {
		const config = this.getNetworkConfig();
		return `${config.explorerUrl}/tx/${signature}`;
	}

	/**
	 * Get SOL balance for an address with retry logic
	 */
	async getBalance(address: string, retryCount: number = 0): Promise<number> {
		try {
			const publicKey = new PublicKey(address);
			const balance = await this.connection.getBalance(publicKey);
			return balance / LAMPORTS_PER_SOL;
		} catch (error: unknown) {
			console.error(`Error getting balance (attempt ${retryCount + 1}):`, error);

			const errorMessage = error instanceof Error ? error.message : '';
			const statusCode = this.extractStatusCode(errorMessage);

			// Handle different error types
			const isRateLimited = statusCode === 429 || errorMessage.includes('Too Many Requests');
			const isForbidden =
				statusCode === 403 || errorMessage.includes('403') || errorMessage.includes('Forbidden');
			const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
			const isServerError = statusCode !== null && statusCode >= 500;

			if ((isRateLimited || isForbidden || isNetworkError || isServerError) && retryCount < 2) {
				if (this.switchToNextRpc()) {
					console.log(`Switching to RPC: ${this.getCurrentRpcUrl()}`);
					return this.getBalance(address, retryCount + 1);
				}
			}

			throw new Error('Failed to get balance: All RPC endpoints unavailable');
		}
	}

	/**
	 * Send SOL transaction
	 */
	async sendSOL(
		fromKeypair: Keypair,
		toAddress: string,
		amount: number
	): Promise<TransactionResult> {
		try {
			const toPublicKey = new PublicKey(toAddress);
			const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

			// Create transaction
			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: fromKeypair.publicKey,
					toPubkey: toPublicKey,
					lamports: lamports
				})
			);

			// Get recent blockhash
			const { blockhash } = await this.connection.getLatestBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = fromKeypair.publicKey;

			// Send and confirm transaction
			const signature = await sendAndConfirmTransaction(
				this.connection,
				transaction,
				[fromKeypair],
				{
					commitment: 'confirmed',
					maxRetries: 3
				}
			);

			return {
				success: true,
				signature: signature
			};
		} catch (error: unknown) {
			console.error('Error sending SOL:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to send transaction'
			};
		}
	}

	/**
	 * Get transaction history for an address with retry logic
	 */
	async getTransactionHistory(
		address: string,
		limit: number = 20,
		retryCount: number = 0
	): Promise<TransactionHistory[]> {
		try {
			const publicKey = new PublicKey(address);
			const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit });

			const transactions = await Promise.allSettled(
				signatures.map(async (sig) => {
					try {
						const tx = await this.connection.getParsedTransaction(sig.signature, {
							maxSupportedTransactionVersion: 0
						});

						if (!tx) return null;

						const instruction = tx.transaction.message.instructions[0];
						if (
							!instruction ||
							instruction.programId.toBase58() !== SystemProgram.programId.toBase58()
						) {
							return null;
						}

						const parsed = instruction as {
							parsed?: {
								info?: {
									source: string;
									destination: string;
									lamports: number;
								};
							};
						};
						const info = parsed.parsed?.info;

						if (!info) return null;

						const isReceive = info.destination === address;
						const amount = info.lamports / LAMPORTS_PER_SOL;

						return {
							signature: sig.signature,
							timestamp: (tx.blockTime || 0) * 1000,
							type: isReceive ? 'receive' : 'send',
							amount: amount,
							token: 'SOL',
							status: sig.confirmationStatus === 'confirmed' ? 'confirmed' : 'pending',
							from: info.source,
							to: info.destination,
							fee: (tx.meta?.fee || 0) / LAMPORTS_PER_SOL,
							explorerUrl: this.getExplorerUrl(sig.signature)
						} as TransactionHistory;
					} catch (error) {
						console.error('Error parsing transaction:', error);
						return null;
					}
				})
			);

			return transactions
				.filter(
					(result): result is PromiseFulfilledResult<TransactionHistory | null> =>
						result.status === 'fulfilled' && result.value !== null
				)
				.map((result) => result.value!)
				.sort((a, b) => b.timestamp - a.timestamp);
		} catch (error: unknown) {
			console.error(`Error getting transaction history (attempt ${retryCount + 1}):`, error);

			const errorMessage = error instanceof Error ? error.message : '';
			const statusCode = this.extractStatusCode(errorMessage);

			// Handle different error types
			const isRateLimited = statusCode === 429 || errorMessage.includes('Too Many Requests');
			const isForbidden =
				statusCode === 403 || errorMessage.includes('403') || errorMessage.includes('Forbidden');
			const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
			const isServerError = statusCode !== null && statusCode >= 500;

			if ((isRateLimited || isForbidden || isNetworkError || isServerError) && retryCount < 2) {
				if (this.switchToNextRpc()) {
					console.log(`Switching to RPC for transaction history: ${this.getCurrentRpcUrl()}`);
					return this.getTransactionHistory(address, limit, retryCount + 1);
				}
			}

			return [];
		}
	}

	/**
	 * Get token accounts for an address with retry logic
	 */
	async getTokenAccounts(address: string, retryCount: number = 0): Promise<TokenInfo[]> {
		try {
			const publicKey = new PublicKey(address);
			const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
				programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
			});

			const tokens: TokenInfo[] = [];

			for (const account of tokenAccounts.value) {
				const accountData = account.account.data as ParsedAccountData;
				const info = accountData.parsed.info;

				if (info.tokenAmount.uiAmount > 0) {
					tokens.push({
						mint: info.mint,
						amount: info.tokenAmount.uiAmount,
						decimals: info.tokenAmount.decimals,
						symbol: 'Unknown', // Would need to fetch from metadata
						name: 'Unknown Token'
					});
				}
			}

			return tokens;
		} catch (error: unknown) {
			console.error(`Error getting token accounts (attempt ${retryCount + 1}):`, error);

			const errorMessage = error instanceof Error ? error.message : '';
			const statusCode = this.extractStatusCode(errorMessage);

			// Handle different error types
			const isRateLimited = statusCode === 429 || errorMessage.includes('Too Many Requests');
			const isForbidden =
				statusCode === 403 || errorMessage.includes('403') || errorMessage.includes('Forbidden');
			const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
			const isServerError = statusCode !== null && statusCode >= 500;

			// Log specific error for user feedback
			if (isForbidden) {
				console.warn('RPC endpoint does not support token account queries (403 Forbidden)');
			} else if (isRateLimited) {
				console.warn('Rate limited by RPC endpoint');
			} else if (isServerError) {
				console.warn('RPC server error');
			}

			// Retry with different RPC for certain errors
			if ((isRateLimited || isForbidden || isNetworkError || isServerError) && retryCount < 2) {
				if (this.switchToNextRpc()) {
					console.log(`Switching to RPC for token accounts: ${this.getCurrentRpcUrl()}`);
					return this.getTokenAccounts(address, retryCount + 1);
				}
			}

			// If all RPCs fail, provide helpful error message
			if (retryCount >= 2) {
				console.warn(
					'All RPC endpoints failed for token account queries. Token list may be unavailable.'
				);
			}

			return [];
		}
	}

	/**
	 * Get user-friendly error message based on error type
	 */
	static getUserFriendlyErrorMessage(error: unknown): string {
		const errorMessage = error instanceof Error ? error.message : '';
		const statusCode = this.extractStatusCodeStatic(errorMessage);

		if (statusCode === 403 || errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
			return 'RPC endpoint restrictions detected. Some features may be limited.';
		} else if (statusCode === 429 || errorMessage.includes('Too Many Requests')) {
			return 'Rate limit reached. Please try again in a few moments.';
		} else if (statusCode && statusCode >= 500) {
			return 'Server error encountered. Please try again later.';
		} else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
			return 'Network connection issue. Check your internet connection.';
		} else {
			return 'An unexpected error occurred. Please try again.';
		}
	}

	/**
	 * Static version of extractStatusCode for static method usage
	 */
	private static extractStatusCodeStatic(errorMessage: string): number | null {
		const statusMatch = errorMessage.match(/\b(\d{3})\b/);
		return statusMatch ? parseInt(statusMatch[1]) : null;
	}

	/**
	 * Extract HTTP status code from error message
	 */
	private extractStatusCode(errorMessage: string): number | null {
		const statusMatch = errorMessage.match(/\b(\d{3})\b/);
		return statusMatch ? parseInt(statusMatch[1]) : null;
	}

	/**
	 * Validate Solana address
	 */
	static isValidAddress(address: string): boolean {
		try {
			new PublicKey(address);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Estimate transaction fee
	 */
	async estimateTransactionFee(
		fromAddress: string,
		toAddress: string,
		amount: number
	): Promise<number> {
		try {
			const fromPublicKey = new PublicKey(fromAddress);
			const toPublicKey = new PublicKey(toAddress);
			const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

			// Create dummy transaction to estimate fee
			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: fromPublicKey,
					toPubkey: toPublicKey,
					lamports: lamports
				})
			);

			const { blockhash } = await this.connection.getLatestBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = fromPublicKey;

			// Get fee for this transaction
			const fee = await this.connection.getFeeForMessage(transaction.compileMessage(), 'confirmed');

			return (fee.value || 5000) / LAMPORTS_PER_SOL;
		} catch (error) {
			console.error('Error estimating fee:', error);
			return 0.000005; // Default fee estimate
		}
	}
}
