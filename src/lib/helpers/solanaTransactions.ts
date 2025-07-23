import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
	LAMPORTS_PER_SOL,
	sendAndConfirmTransaction,
	Keypair
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { ParsedAccountData } from '@solana/web3.js';
import { PUBLIC_HELIUS_API_KEY } from '$env/static/public';
import type {
	NetworkType,
	NetworkConfig,
	TransactionResult,
	TokenInfo,
	TransactionHistory
} from '../../types/types';

// Re-export NetworkType so it can be imported from this module
export type { NetworkType, NetworkConfig } from '../../types/types';
import {
	getImportedTokens,
	addImportedToken,
	removeImportedToken,
	cleanupLegacyTokenStorage
} from '$lib/utils/storage-utils';

// Magic Eden API types
interface MagicEdenCollectionStats {
	symbol: string;
	floorPrice: number;
	listedCount: number;
	volumeAll: number;
	txns24hr: number;
	deltaFloor24hr: number;
	fpPctChg24hr: number;
}

interface MagicEdenNFT {
	mintAddress: string;
	price?: number;
	listingType?: string;
	tokenStandard: number;
	owner: string;
	name?: string;
	image?: string;
	attributes?: Array<{ trait_type: string; value: string }>;
}

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
	mainnet: {
		name: 'Mainnet',
		rpcUrls: [
			`https://mainnet.helius-rpc.com/?api-key=${PUBLIC_HELIUS_API_KEY}`,
			'https://api.mainnet-beta.solana.com',
			'https://solana-api.projectserum.com'
		],
		explorerUrl: 'https://explorer.solana.com'
	},
	testnet: {
		name: 'Testnet',
		rpcUrls: [
			`https://devnet.helius-rpc.com/?api-key=${PUBLIC_HELIUS_API_KEY}`,
			'https://api.testnet.solana.com',
			'https://testnet.solana.com'
		],
		explorerUrl: 'https://explorer.solana.com?cluster=testnet'
	},
	devnet: {
		name: 'Devnet',
		rpcUrls: [
			`https://devnet.helius-rpc.com/?api-key=${PUBLIC_HELIUS_API_KEY}`,
			'https://api.devnet.solana.com',
			'https://devnet.solana.com'
		],
		explorerUrl: 'https://explorer.solana.com?cluster=devnet'
	}
};

// Default tokens that should always be displayed (Netsepio ecosystem)
const DEFAULT_TOKENS = [
	{
		mint: '6Tph3SxbAW12BSJdCevVV9Zujh97X69d5MJ4XjwKmray',
		symbol: 'CYAI',
		name: 'CyreneAI',
		decimals: 9, // Standard for Solana tokens
		isDefault: true
	}
	// Add more Netsepio ecosystem tokens here as they become available
];

export class SolanaWalletService {
	private connection: Connection;
	private networkType: NetworkType;
	private rpcEndpoints: string[];
	private currentRpcIndex: number = 0;

	constructor(networkType: NetworkType = 'mainnet') {
		this.networkType = networkType;
		this.rpcEndpoints = NETWORK_CONFIGS[this.networkType].rpcUrls;
		this.connection = new Connection(this.rpcEndpoints[0], 'confirmed');
	}

	/**
	 * Get next RPC endpoint for fallback
	 */
	private getNextRpcEndpoint(): string {
		this.currentRpcIndex = (this.currentRpcIndex + 1) % this.rpcEndpoints.length;
		return this.rpcEndpoints[this.currentRpcIndex];
	}

	/**
	 * Execute RPC call with retry logic and fallback endpoints
	 */
	private async executeWithRetry<T>(
		operation: (connection: Connection) => Promise<T>,
		maxRetries: number = 3
	): Promise<T> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				return await operation(this.connection);
			} catch (error) {
				lastError = error instanceof Error ? error : new Error('Unknown error');

				// Check if it's a rate limit error
				if (lastError.message.includes('429') || lastError.message.includes('Too Many Requests')) {
					console.warn(
						`Rate limit hit, trying fallback endpoint. Attempt ${attempt + 1}/${maxRetries}`
					);

					// Switch to next RPC endpoint
					const nextEndpoint = this.getNextRpcEndpoint();
					this.connection = new Connection(nextEndpoint, 'confirmed');

					// Add delay before retry
					await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
					continue;
				}

				// For other errors, only retry if not the last attempt
				if (attempt < maxRetries - 1) {
					await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
					continue;
				}
			}
		}

		throw lastError || new Error('Operation failed after retries');
	}

	switchNetwork(networkType: NetworkType): void {
		this.networkType = networkType;
		this.rpcEndpoints = NETWORK_CONFIGS[this.networkType].rpcUrls;
		this.currentRpcIndex = 0;
		this.connection = new Connection(this.rpcEndpoints[0], 'confirmed');
	}

	getExplorerUrl(signature: string): string {
		const config = NETWORK_CONFIGS[this.networkType];
		return `${config.explorerUrl}/tx/${signature}`;
	}

	getConnection(): Connection {
		return this.connection;
	}

	async getBalance(address: string): Promise<number> {
		return this.executeWithRetry(async (connection) => {
			const publicKey = new PublicKey(address);
			const balance = await connection.getBalance(publicKey);
			return balance / LAMPORTS_PER_SOL;
		});
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
	async getTransactionHistory(address: string, limit: number = 20): Promise<TransactionHistory[]> {
		return this.executeWithRetry(async (connection) => {
			const publicKey = new PublicKey(address);
			const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
			const transactions = await Promise.all(
				signatures.map(async (sig) => {
					try {
						const tx = await connection.getParsedTransaction(sig.signature, {
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
			return transactions.filter((tx): tx is TransactionHistory => tx !== null);
		});
	}

	/**
	 * Get token accounts for an address with retry logic and metadata
	 */
	async getTokenAccounts(address: string): Promise<TokenInfo[]> {
		return this.executeWithRetry(async (connection) => {
			const publicKey = new PublicKey(address);
			const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
				programId: TOKEN_PROGRAM_ID
			});
			const tokens: TokenInfo[] = [];

			// Get imported tokens from extension storage for this specific wallet (exclude NFT collections)
			console.log(`Getting imported tokens for wallet: ${address}`);
			const importedTokens = (await this.getImportedTokensForWallet(address)).filter(
				(t) => t.type !== 'nft_collection'
			);
			console.log(
				`Found ${importedTokens.length} imported tokens for wallet ${address}:`,
				importedTokens
			);

			// First, add tokens that have balances
			for (const account of tokenAccounts.value) {
				const accountData = account.account.data as ParsedAccountData;
				const info = accountData.parsed.info;

				// Check if we have metadata for this token
				const importedToken = importedTokens.find((t) => t.mint === info.mint);

				let tokenInfo: TokenInfo;
				if (importedToken) {
					tokenInfo = {
						mint: info.mint,
						amount: info.tokenAmount.uiAmount,
						decimals: info.tokenAmount.decimals,
						symbol: importedToken.symbol,
						name: importedToken.name
					};
				} else {
					// Try to fetch metadata from token registry or on-chain
					try {
						const metadata = await this.fetchTokenMetadata(info.mint);
						tokenInfo = {
							mint: info.mint,
							amount: info.tokenAmount.uiAmount,
							decimals: info.tokenAmount.decimals,
							symbol: metadata.symbol || 'Unknown',
							name: metadata.name || 'Unknown Token'
						};
					} catch {
						// If metadata fetch fails, use defaults
						tokenInfo = {
							mint: info.mint,
							amount: info.tokenAmount.uiAmount,
							decimals: info.tokenAmount.decimals,
							symbol: 'Unknown',
							name: 'Unknown Token'
						};
					}
				}

				tokens.push(tokenInfo);
			}

			// Then, add imported tokens that don't have accounts yet (0 balance)
			// Only add actual tokens, not NFT collections
			for (const importedToken of importedTokens) {
				const exists = tokens.find((t) => t.mint === importedToken.mint);
				if (!exists) {
					// Add imported token with 0 balance
					tokens.push({
						mint: importedToken.mint,
						amount: 0,
						decimals: importedToken.decimals,
						symbol: importedToken.symbol,
						name: importedToken.name
					});
				}
			}

			// Add default tokens (like CYAI) even if user doesn't hold them
			for (const defaultToken of DEFAULT_TOKENS) {
				const exists = tokens.find((t) => t.mint === defaultToken.mint);
				if (!exists) {
					// Check if user has a token account for this mint (but with 0 balance)
					try {
						const tokenAccount = await connection.getParsedTokenAccountsByOwner(publicKey, {
							mint: new PublicKey(defaultToken.mint)
						});

						const balance =
							tokenAccount.value.length > 0
								? tokenAccount.value[0].account.data.parsed.info.tokenAmount.uiAmount
								: 0;

						tokens.push({
							mint: defaultToken.mint,
							amount: balance,
							decimals: defaultToken.decimals,
							symbol: defaultToken.symbol,
							name: defaultToken.name,
							isDefault: true
						});
					} catch {
						// If we can't get the token account, show with 0 balance
						tokens.push({
							mint: defaultToken.mint,
							amount: 0,
							decimals: defaultToken.decimals,
							symbol: defaultToken.symbol,
							name: defaultToken.name,
							isDefault: true
						});
					}
				} else {
					// Mark existing token as default
					exists.isDefault = true;
				}
			}

			// Sort tokens: default tokens first, then by balance (highest first)
			tokens.sort((a, b) => {
				if (a.isDefault && !b.isDefault) return -1;
				if (!a.isDefault && b.isDefault) return 1;
				return b.amount - a.amount;
			});

			return tokens;
		});
	}

	/**
	 * Fetch token metadata from various sources
	 */
	async fetchTokenMetadata(mint: string): Promise<{ symbol: string; name: string }> {
		try {
			// First try Solana Token Registry
			const registryUrl = `https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json`;
			const registryResponse = await fetch(registryUrl);
			const registry = await registryResponse.json();

			const tokenInfo = registry.tokens.find(
				(token: { address: string; symbol: string; name: string }) => token.address === mint
			);
			if (tokenInfo) {
				return {
					symbol: tokenInfo.symbol,
					name: tokenInfo.name
				};
			}
		} catch (error) {
			console.warn('Failed to fetch from token registry:', error);
		}

		// If not found in registry, try on-chain metadata
		try {
			const response = await fetch(this.connection.rpcEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAccountInfo',
					params: [mint, { encoding: 'jsonParsed' }]
				})
			});

			const data = await response.json();
			const accountInfo = data.result?.value?.data?.parsed?.info;

			if (accountInfo) {
				return {
					symbol: accountInfo.symbol || 'Unknown',
					name: accountInfo.name || 'Unknown Token'
				};
			}
		} catch (error) {
			console.warn('Failed to fetch on-chain metadata:', error);
		}

		return { symbol: 'Unknown', name: 'Unknown Token' };
	}

	/**
	 * Fetch NFT collection data from Magic Eden API
	 */
	async fetchNFTCollectionData(collectionSymbol: string): Promise<MagicEdenCollectionStats | null> {
		try {
			const response = await fetch(
				`https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}/stats`
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch collection data: ${response.status}`);
			}
			const data = await response.json();
			return data.results;
		} catch (error) {
			console.error('Error fetching NFT collection data:', error);
			return null;
		}
	}

	/**
	 * Fetch NFTs from a specific collection owned by an address
	 */
	async getNFTsFromCollection(address: string, collectionSymbol: string): Promise<MagicEdenNFT[]> {
		try {
			const response = await fetch(
				`https://api-mainnet.magiceden.dev/v2/wallets/${address}/tokens?collection=${collectionSymbol}`
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch NFTs: ${response.status}`);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching NFTs from collection:', error);
			return [];
		}
	}

	/**
	 * Get Cyrene AI Cosmic Journey NFTs owned by address
	 */
	async getCyreneAINFTs(address: string): Promise<MagicEdenNFT[]> {
		return this.getNFTsFromCollection(address, 'cyreneai_cosmic_journey');
	}

	/**
	 * Get imported tokens from extension storage (wallet-specific)
	 */
	async getImportedTokensForWallet(walletAddress?: string): Promise<
		Array<{
			mint: string;
			symbol: string;
			name: string;
			decimals: number;
			type?: 'token' | 'nft_collection';
			collectionSymbol?: string;
		}>
	> {
		try {
			// If no wallet address provided, try to get from current context or return empty
			if (!walletAddress) {
				// Try to get wallet address from localStorage or current context
				const currentWallet =
					localStorage.getItem('walletAddress') || localStorage.getItem('walletAddress_backup');
				if (!currentWallet || currentWallet === 'none') {
					return []; // No wallet, no tokens
				}
				walletAddress = currentWallet;
			}

			console.log(`Getting imported tokens for wallet: ${walletAddress} from extension storage`);
			const tokens = await getImportedTokens(walletAddress);
			console.log(`Found ${tokens.length} imported tokens for wallet ${walletAddress}:`, tokens);
			return tokens;
		} catch (error) {
			console.error('Error reading imported tokens from extension storage:', error);
			return [];
		}
	}

	/**
	 * Add a token to the imported tokens list (wallet-specific) using extension storage
	 */
	async addImportedTokenToWallet(
		token: {
			mint: string;
			symbol: string;
			name: string;
			decimals: number;
			type?: 'token' | 'nft_collection';
			collectionSymbol?: string;
		},
		walletAddress?: string
	): Promise<void> {
		try {
			// If no wallet address provided, try to get from current context
			if (!walletAddress) {
				const currentWallet =
					localStorage.getItem('walletAddress') || localStorage.getItem('walletAddress_backup');
				if (!currentWallet || currentWallet === 'none') {
					console.error('Cannot add token: No wallet address available');
					return;
				}
				walletAddress = currentWallet;
			}

			await addImportedToken(token, walletAddress);
		} catch (error) {
			console.error('Error adding imported token:', error);
		}
	}

	/**
	 * Remove a token from the imported tokens list (wallet-specific) using extension storage
	 */
	async removeImportedTokenFromWallet(mint: string, walletAddress?: string): Promise<void> {
		try {
			// If no wallet address provided, try to get from current context
			if (!walletAddress) {
				const currentWallet =
					localStorage.getItem('walletAddress') || localStorage.getItem('walletAddress_backup');
				if (!currentWallet || currentWallet === 'none') {
					console.error('Cannot remove token: No wallet address available');
					return;
				}
				walletAddress = currentWallet;
			}

			await removeImportedToken(mint, walletAddress);
		} catch (error) {
			console.error('Error removing imported token:', error);
		}
	}

	/**
	 * Clean up legacy global token storage to prevent cross-wallet contamination
	 */
	static async cleanupLegacyTokenStorageData(): Promise<void> {
		await cleanupLegacyTokenStorage();
	}

	/**
	 * Get user-friendly error message based on error type
	 */
	static getUserFriendlyErrorMessage(error: unknown): string {
		const errorMessage = error instanceof Error ? error.message : '';
		if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
			return 'RPC endpoint restrictions detected. Some features may be limited.';
		} else if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
			return 'Rate limit reached. Please try again in a few moments.';
		} else if (errorMessage.includes('500')) {
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
			const fee = await this.connection.getFeeForMessage(transaction.compileMessage(), 'confirmed');
			return (fee.value || 5000) / LAMPORTS_PER_SOL;
		} catch (error) {
			console.error('Error estimating fee:', error);
			return 0.000005;
		}
	}
}
