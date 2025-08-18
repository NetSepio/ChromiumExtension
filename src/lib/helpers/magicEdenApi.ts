/**
 * Magic Eden API Service
 * Provides functionality to fetch NFTs owned by a Solana wallet address
 */

import { PUBLIC_MAGIC_EDEN_API_KEY } from '$env/static/public';

// Define the NFT data structure to match existing wallet expectations
export interface MagicEdenNFT {
	mintAddress: string;
	name: string;
	symbol: string;
	image: string;
	description?: string;
	collectionName?: string;
	collectionImage?: string;
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
	floorPrice?: number;
	lastSale?: number;
}

// Magic Eden API response structure
interface MagicEdenTokenResponse {
	mint: string;
	name: string;
	symbol: string;
	image: string;
	description?: string;
	collection?: {
		name: string;
		image: string;
		floorPrice?: number;
	};
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
	lastSale?: {
		price: number;
	};
}

export class MagicEdenService {
	private static readonly BASE_URL = 'https://api-mainnet.magiceden.dev';

	/**
	 * Fetch all NFTs owned by a wallet address
	 */
	static async getUserNFTs(walletAddress: string): Promise<MagicEdenNFT[]> {
		try {
			if (!PUBLIC_MAGIC_EDEN_API_KEY) {
				throw new Error('Magic Eden API key not configured');
			}

			console.log(`Fetching NFTs for wallet: ${walletAddress}`);

			const response = await fetch(`${this.BASE_URL}/v2/wallets/${walletAddress}/tokens`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${PUBLIC_MAGIC_EDEN_API_KEY}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					console.log('No NFTs found for this wallet');
					return [];
				}
				throw new Error(`Magic Eden API error: ${response.status} ${response.statusText}`);
			}

			const data: MagicEdenTokenResponse[] = await response.json();

			if (!Array.isArray(data)) {
				console.warn('Unexpected response format from Magic Eden API');
				return [];
			}

			// Transform Magic Eden response to our NFT format
			const nfts: MagicEdenNFT[] = data.map((token) => ({
				mintAddress: token.mint,
				name: token.name || 'Unknown NFT',
				symbol: token.symbol || '',
				image: token.image || '',
				description: token.description,
				collectionName: token.collection?.name,
				collectionImage: token.collection?.image,
				attributes: token.attributes,
				floorPrice: token.collection?.floorPrice,
				lastSale: token.lastSale?.price
			}));

			console.log(`Found ${nfts.length} NFTs for wallet ${walletAddress}`);
			return nfts;
		} catch (error) {
			console.error('Error fetching NFTs from Magic Eden:', error);

			// Return empty array instead of throwing to prevent UI crashes
			if (error instanceof Error) {
				console.error('Magic Eden API error details:', error.message);
			}

			return [];
		}
	}

	/**
	 * Get collection statistics
	 */
	static async getCollectionStats(collectionSymbol: string): Promise<{
		floorPrice?: number;
		totalVolume?: number;
		totalSupply?: number;
	} | null> {
		try {
			if (!PUBLIC_MAGIC_EDEN_API_KEY) {
				throw new Error('Magic Eden API key not configured');
			}

			const response = await fetch(`${this.BASE_URL}/v2/collections/${collectionSymbol}/stats`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${PUBLIC_MAGIC_EDEN_API_KEY}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				console.warn(`Failed to fetch collection stats for ${collectionSymbol}`);
				return null;
			}

			const stats = await response.json();
			return {
				floorPrice: stats.floorPrice,
				totalVolume: stats.totalVolume,
				totalSupply: stats.totalSupply
			};
		} catch (error) {
			console.error('Error fetching collection stats:', error);
			return null;
		}
	}

	/**
	 * Check if Magic Eden API is available
	 */
	static async healthCheck(): Promise<boolean> {
		try {
			if (!PUBLIC_MAGIC_EDEN_API_KEY) {
				return false;
			}

			// Use a simple endpoint to check API availability
			const response = await fetch(`${this.BASE_URL}/v2/collections?offset=0&limit=1`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${PUBLIC_MAGIC_EDEN_API_KEY}`,
					'Content-Type': 'application/json'
				}
			});

			return response.ok;
		} catch (error) {
			console.error('Magic Eden health check failed:', error);
			return false;
		}
	}
}

// Export a convenience function for easy importing
export const getUserNFTs = MagicEdenService.getUserNFTs;
export const getCollectionStats = MagicEdenService.getCollectionStats;
export const checkMagicEdenHealth = MagicEdenService.healthCheck;
