import { ethers } from 'ethers';
import { NETWORK_CONFIGS } from '$lib/getBalance';

export interface EVMTokenInfo {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	balance: string;
	amount: number;
}

export interface EVMTransactionHistory {
	hash: string;
	type: 'send' | 'receive' | 'contract';
	amount: number;
	token: string;
	from: string;
	to: string;
	timestamp: number;
	status: 'confirmed' | 'pending' | 'failed';
	fee?: number;
	explorerUrl?: string;
	gasUsed?: number;
	gasPrice?: string;
}

export class EVMWalletService {
	private provider: ethers.JsonRpcProvider;
	private networkConfig: (typeof NETWORK_CONFIGS)[string];
	private network: string;

	constructor(network: keyof typeof NETWORK_CONFIGS) {
		this.network = network;
		this.networkConfig = NETWORK_CONFIGS[network];
		if (!this.networkConfig) {
			throw new Error(`Unsupported network: ${network}`);
		}
		this.provider = new ethers.JsonRpcProvider(this.networkConfig.rpcUrl);
	}

	/**
	 * Get native token balance (ETH, PEAQ, RISE)
	 */
	async getBalance(address: string): Promise<string> {
		try {
			const balance = await this.provider.getBalance(address);
			return ethers.formatEther(balance);
		} catch (error) {
			console.error('Error fetching EVM balance:', error);
			throw error;
		}
	}

	/**
	 * Get ERC-20 token accounts for an address
	 */
	async getTokenAccounts(address: string): Promise<EVMTokenInfo[]> {
		try {
			const importedTokens = await this.getImportedTokensForWallet(address);
			const tokenAccounts: EVMTokenInfo[] = [];

			for (const tokenAddress of importedTokens) {
				try {
					const tokenInfo = await this.getTokenInfo(tokenAddress, address);
					if (tokenInfo && parseFloat(tokenInfo.balance) > 0) {
						tokenAccounts.push(tokenInfo);
					}
				} catch (error) {
					console.warn(`Failed to fetch token info for ${tokenAddress}:`, error);
				}
			}

			return tokenAccounts;
		} catch (error) {
			console.error('Error fetching EVM token accounts:', error);
			return [];
		}
	}

	/**
	 * Get token information including balance
	 */
	async getTokenInfo(tokenAddress: string, walletAddress: string): Promise<EVMTokenInfo | null> {
		try {
			// Standard ERC-20 ABI for the functions we need
			const erc20Abi = [
				'function name() view returns (string)',
				'function symbol() view returns (string)',
				'function decimals() view returns (uint8)',
				'function balanceOf(address) view returns (uint256)'
			];

			const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);

			const [name, symbol, decimals, balance] = await Promise.all([
				contract.name(),
				contract.symbol(),
				contract.decimals(),
				contract.balanceOf(walletAddress)
			]);

			const formattedBalance = ethers.formatUnits(balance, decimals);
			const amount = parseFloat(formattedBalance);

			return {
				address: tokenAddress,
				name,
				symbol,
				decimals: Number(decimals),
				balance: formattedBalance,
				amount
			};
		} catch (error) {
			console.error(`Error fetching token info for ${tokenAddress}:`, error);
			return null;
		}
	}

	/**
	 * Get transaction history for an address
	 */
	async getTransactionHistory(
		address: string,
		limit: number = 10
	): Promise<EVMTransactionHistory[]> {
		try {
			// Get the latest block number
			const latestBlock = await this.provider.getBlockNumber();
			const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10k blocks

			// Get transactions where address is sender or receiver
			const transactions: EVMTransactionHistory[] = [];

			// Note: This is a basic implementation. In production, you'd want to use
			// a blockchain indexer service like Alchemy, Moralis, or The Graph
			// for better performance and more comprehensive transaction history

			try {
				// Get recent blocks and filter transactions
				const blockPromises = [];
				const maxBlocks = Math.min(50, latestBlock - fromBlock); // Limit to prevent timeouts

				for (let i = 0; i < maxBlocks && transactions.length < limit; i++) {
					blockPromises.push(this.provider.getBlock(latestBlock - i, true));
				}

				const blocks = await Promise.all(blockPromises);

				for (const block of blocks) {
					if (!block || !block.transactions) continue;

					for (const txData of block.transactions) {
						if (typeof txData === 'string') continue;

						// Type assertion to help TypeScript understand the transaction object
						const tx = txData as ethers.TransactionResponse;

						if (transactions.length >= limit) break;

						if (
							tx.from?.toLowerCase() === address.toLowerCase() ||
							tx.to?.toLowerCase() === address.toLowerCase()
						) {
							const receipt = await this.provider.getTransactionReceipt(tx.hash);
							const type = tx.from?.toLowerCase() === address.toLowerCase() ? 'send' : 'receive';

							transactions.push({
								hash: tx.hash,
								type,
								amount: parseFloat(ethers.formatEther(tx.value || 0)),
								token: this.networkConfig.symbol,
								from: tx.from || '',
								to: tx.to || '',
								timestamp: (block.timestamp || 0) * 1000,
								status: receipt?.status === 1 ? 'confirmed' : 'failed',
								fee: receipt
									? parseFloat(ethers.formatEther(receipt.gasUsed * (tx.gasPrice || 0n)))
									: undefined,
								explorerUrl: this.getExplorerUrl(tx.hash),
								gasUsed: receipt ? Number(receipt.gasUsed) : undefined,
								gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : undefined
							});
						}
					}
				}
			} catch (scanError) {
				console.warn('Block scanning failed, returning empty transaction history:', scanError);
			}

			return transactions.sort((a, b) => b.timestamp - a.timestamp);
		} catch (error) {
			console.error('Error fetching EVM transaction history:', error);
			return [];
		}
	}

	/**
	 * Get explorer URL for transaction
	 */
	private getExplorerUrl(txHash: string): string {
		// Default explorers for each network
		const explorers: Record<string, string> = {
			'peaq-mainnet': 'https://peaq.subscan.io',
			'peaq-testnet': 'https://peaq-testnet.subscan.io',
			'rise-testnet': 'https://testnet.risescan.org'
		};

		const baseUrl = explorers[this.network];
		return baseUrl ? `${baseUrl}/tx/${txHash}` : '';
	}

	/**
	 * Add a token to the imported tokens list for a wallet
	 */
	async addImportedToken(walletAddress: string, tokenAddress: string): Promise<void> {
		try {
			// Validate token address
			if (!ethers.isAddress(tokenAddress)) {
				throw new Error('Invalid token address');
			}

			// Verify it's a valid ERC-20 token
			const tokenInfo = await this.getTokenInfo(tokenAddress, walletAddress);
			if (!tokenInfo) {
				throw new Error('Unable to fetch token information. Please verify the contract address.');
			}

			const storageKey = `evm-imported-tokens-${walletAddress}-${this.network}`;
			const existingTokens = await this.getImportedTokensForWallet(walletAddress);

			if (!existingTokens.includes(tokenAddress.toLowerCase())) {
				const updatedTokens = [...existingTokens, tokenAddress.toLowerCase()];
				await chrome.storage.local.set({ [storageKey]: updatedTokens });
				console.log(
					`Added EVM token ${tokenAddress} for wallet ${walletAddress} on ${this.network}`
				);
			}
		} catch (error) {
			console.error('Error adding imported token:', error);
			throw error;
		}
	}

	/**
	 * Get imported tokens for a wallet
	 */
	async getImportedTokensForWallet(walletAddress: string): Promise<string[]> {
		try {
			const storageKey = `evm-imported-tokens-${walletAddress}-${this.network}`;
			const result = await chrome.storage.local.get([storageKey]);
			return result[storageKey] || [];
		} catch (error) {
			console.error('Error getting imported tokens:', error);
			return [];
		}
	}

	/**
	 * Remove a token from imported tokens
	 */
	async removeImportedToken(walletAddress: string, tokenAddress: string): Promise<void> {
		try {
			const storageKey = `evm-imported-tokens-${walletAddress}-${this.network}`;
			const existingTokens = await this.getImportedTokensForWallet(walletAddress);
			const updatedTokens = existingTokens.filter(
				(token) => token.toLowerCase() !== tokenAddress.toLowerCase()
			);
			await chrome.storage.local.set({ [storageKey]: updatedTokens });
		} catch (error) {
			console.error('Error removing imported token:', error);
			throw error;
		}
	}

	/**
	 * Validate if an address is a valid ERC-20 token
	 */
	async isValidToken(tokenAddress: string): Promise<boolean> {
		try {
			if (!ethers.isAddress(tokenAddress)) {
				return false;
			}

			const erc20Abi = [
				'function name() view returns (string)',
				'function symbol() view returns (string)',
				'function decimals() view returns (uint8)',
				'function totalSupply() view returns (uint256)'
			];

			const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);

			// Try to call basic ERC-20 functions
			await Promise.all([
				contract.name(),
				contract.symbol(),
				contract.decimals(),
				contract.totalSupply()
			]);

			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get user-friendly error message
	 */
	static getUserFriendlyErrorMessage(error: any): string {
		if (!error) return 'Unknown error occurred';

		const message = error.message || error.toString();

		if (message.includes('network')) {
			return 'Network connection error. Please check your internet connection.';
		}
		if (message.includes('timeout')) {
			return 'Request timed out. Please try again.';
		}
		if (message.includes('invalid address')) {
			return 'Invalid wallet or token address.';
		}
		if (message.includes('insufficient funds')) {
			return 'Insufficient funds for this transaction.';
		}

		return 'An error occurred. Please try again later.';
	}

	/**
	 * Get current network info
	 */
	getNetworkInfo() {
		return {
			name: this.networkConfig.name,
			symbol: this.networkConfig.symbol,
			chainId: this.networkConfig.chainId,
			isTestnet: this.networkConfig.isTestnet,
			rpcUrl: this.networkConfig.rpcUrl
		};
	}
}
