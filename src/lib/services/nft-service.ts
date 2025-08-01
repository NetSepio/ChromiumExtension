import { SolanaWalletService } from '$lib/helpers/solanaTransactions';

export interface NFTCollection {
	symbol: string;
	name: string;
	description?: string;
	image?: string;
	floorPrice?: number;
	listedCount?: number;
	volume24h?: number;
	owners?: number;
	supply?: number;
	isVerified?: boolean;
	isCyai?: boolean;
}

export interface NFTMetadata {
	mint: string;
	name: string;
	symbol: string;
	description?: string;
	image?: string;
	external_url?: string;
	collection?: {
		name: string;
		family?: string;
		verified?: boolean;
	};
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
	properties?: {
		category?: string;
		creators?: Array<{
			address: string;
			share: number;
			verified?: boolean;
		}>;
	};
	floorPrice?: number;
	lastSale?: number;
	rarity?: {
		rank?: number;
		score?: number;
	};
}

export interface TrendingCollection {
	symbol: string;
	name: string;
	image?: string;
	floorPrice: number;
	floorChange24h: number;
	volume24h: number;
	volumeChange24h: number;
	listedCount: number;
	owners: number;
	supply: number;
}

export class NFTService {
	private rpcUrl: string;
	private walletService: SolanaWalletService;

	// CYAI Cosmic Journey collection identifier
	private static readonly CYAI_COLLECTION_SYMBOL = 'cyreneai_cosmic_journey';
	private static readonly CYAI_COLLECTION_NAME = 'CyreneAI Cosmic Journey';

	constructor(network: 'mainnet' | 'testnet' = 'mainnet') {
		this.rpcUrl = network;
		this.walletService = new SolanaWalletService(network);
	}

	/**
	 * Get trending NFT collections from multiple sources
	 */
	async getTrendingCollections(limit: number = 20): Promise<TrendingCollection[]> {
		try {
			// Try Magic Eden API first
			const response = await fetch('https://api-mainnet.magiceden.dev/v2/collections/stats');
			const collections = await response.json();

			const trending: TrendingCollection[] = collections.slice(0, limit).map((collection: any) => ({
				symbol: collection.symbol,
				name: collection.name || collection.symbol,
				image: collection.image,
				floorPrice: collection.floorPrice / 1000000000 || 0, // Convert lamports to SOL
				floorChange24h: collection.floorPriceChange24h || 0,
				volume24h: collection.volumeAll / 1000000000 || 0,
				volumeChange24h: collection.volumeChange24h || 0,
				listedCount: collection.listedCount || 0,
				owners: collection.uniqueHolders || 0,
				supply: collection.totalItems || 0
			}));

			// Ensure CYAI collection is included and prioritized
			const cyaiIndex = trending.findIndex(
				(c) =>
					c.symbol.toLowerCase().includes('cyai') ||
					c.name.toLowerCase().includes('cyreneai') ||
					c.symbol === NFTService.CYAI_COLLECTION_SYMBOL
			);

			if (cyaiIndex === -1) {
				// Add CYAI collection manually if not found
				const cyaiCollection = await this.getCyaiCollectionStats();
				if (cyaiCollection) {
					trending.unshift(cyaiCollection);
				}
			} else if (cyaiIndex > 2) {
				// Move CYAI to top 3 if it's lower
				const cyai = trending.splice(cyaiIndex, 1)[0];
				trending.splice(2, 0, cyai);
			}

			return trending;
		} catch (error) {
			console.error('Error fetching trending collections:', error);

			// Fallback with CYAI collection
			const cyaiCollection = await this.getCyaiCollectionStats();
			return cyaiCollection ? [cyaiCollection] : [];
		}
	}

	/**
	 * Get specific CYAI collection stats
	 */
	private async getCyaiCollectionStats(): Promise<TrendingCollection | null> {
		try {
			const response = await fetch(
				`https://api-mainnet.magiceden.dev/v2/collections/${NFTService.CYAI_COLLECTION_SYMBOL}/stats`
			);
			if (!response.ok) throw new Error('CYAI collection not found');

			const stats = await response.json();
			return {
				symbol: NFTService.CYAI_COLLECTION_SYMBOL,
				name: NFTService.CYAI_COLLECTION_NAME,
				image: stats.image || '',
				floorPrice: (stats.floorPrice || 0) / 1000000000,
				floorChange24h: stats.floorPriceChange24h || 0,
				volume24h: (stats.volumeAll || 0) / 1000000000,
				volumeChange24h: stats.volumeChange24h || 0,
				listedCount: stats.listedCount || 0,
				owners: stats.uniqueHolders || 0,
				supply: stats.totalItems || 0
			};
		} catch (error) {
			console.error('Error fetching CYAI collection stats:', error);
			// Return default CYAI collection data
			return {
				symbol: NFTService.CYAI_COLLECTION_SYMBOL,
				name: NFTService.CYAI_COLLECTION_NAME,
				image: '',
				floorPrice: 0,
				floorChange24h: 0,
				volume24h: 0,
				volumeChange24h: 0,
				listedCount: 0,
				owners: 0,
				supply: 0
			};
		}
	}

	/**
	 * Search NFT collections by name
	 */
	async searchCollections(query: string, limit: number = 10): Promise<NFTCollection[]> {
		try {
			const response = await fetch(
				`https://api-mainnet.magiceden.dev/v2/collections?q=${encodeURIComponent(query)}&limit=${limit}`
			);
			const collections = await response.json();

			return collections.map((collection: any) => ({
				symbol: collection.symbol,
				name: collection.name || collection.symbol,
				description: collection.description,
				image: collection.image,
				floorPrice: collection.floorPrice ? collection.floorPrice / 1000000000 : undefined,
				isVerified: collection.verified || false,
				isCyai:
					collection.symbol.toLowerCase().includes('cyai') ||
					collection.name.toLowerCase().includes('cyreneai')
			}));
		} catch (error) {
			console.error('Error searching collections:', error);
			return [];
		}
	}

	/**
	 * Get NFTs from a specific collection
	 */
	async getCollectionNFTs(
		collectionSymbol: string,
		limit: number = 20,
		offset: number = 0
	): Promise<NFTMetadata[]> {
		try {
			const response = await fetch(
				`https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}/listings?offset=${offset}&limit=${limit}`
			);
			const nfts = await response.json();

			return nfts.map((nft: any) => ({
				mint: nft.tokenMint,
				name: nft.title || 'Unnamed NFT',
				symbol: collectionSymbol,
				description: nft.description,
				image: nft.img,
				external_url: nft.externalURL,
				collection: {
					name: nft.collectionTitle,
					verified: true
				},
				attributes: nft.attributes || [],
				floorPrice: nft.price ? nft.price / 1000000000 : undefined,
				properties: {
					creators: nft.creators || []
				}
			}));
		} catch (error) {
			console.error(`Error fetching NFTs for collection ${collectionSymbol}:`, error);
			return [];
		}
	}

	/**
	 * Get NFT metadata by mint address using Helius
	 */
	async getNFTMetadata(mint: string): Promise<NFTMetadata | null> {
		try {
			// Try Helius API for better metadata
			const heliusUrl =
				this.rpcUrl === 'mainnet'
					? 'https://rpc.helius.xyz/?api-key=demo'
					: 'https://rpc-devnet.helius.xyz/?api-key=demo';

			const response = await fetch(heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAsset',
					params: { id: mint }
				})
			});

			const data = await response.json();
			if (!data.result) return null;

			const asset = data.result;
			return {
				mint,
				name: asset.content?.metadata?.name || 'Unnamed NFT',
				symbol: asset.content?.metadata?.symbol || '',
				description: asset.content?.metadata?.description,
				image: asset.content?.files?.[0]?.uri || asset.content?.metadata?.image,
				external_url: asset.content?.metadata?.external_url,
				collection: asset.grouping?.find((g: any) => g.group_key === 'collection')
					? {
							name: asset.content?.metadata?.collection?.name || 'Unknown Collection',
							verified: asset.content?.metadata?.collection?.verified || false
						}
					: undefined,
				attributes: asset.content?.metadata?.attributes || [],
				properties: {
					category: asset.content?.metadata?.properties?.category,
					creators: asset.creators || []
				}
			};
		} catch (error) {
			console.error(`Error fetching NFT metadata for ${mint}:`, error);
			return null;
		}
	}

	/**
	 * Get user's NFTs using existing wallet service
	 */
	async getUserNFTs(walletAddress: string): Promise<NFTMetadata[]> {
		try {
			// Use existing wallet service to get CYAI NFTs (for now, as there's no general getNFTs method)
			const cyaiNFTs = await this.walletService.getCyreneAINFTs(walletAddress);

			// Convert to our NFTMetadata format
			return cyaiNFTs.map((nft: any) => ({
				mint: nft.mintAddress,
				name: nft.name || 'Unnamed NFT',
				symbol: nft.symbol || '',
				description: nft.description || '',
				image: nft.image,
				external_url: nft.external_url,
				collection: {
					name: NFTService.CYAI_COLLECTION_NAME,
					verified: true
				},
				attributes: nft.attributes || [],
				properties: {
					category: 'pfp'
				}
			}));
		} catch (error) {
			console.error(`Error fetching user NFTs for ${walletAddress}:`, error);
			return [];
		}
	}

	/**
	 * Get CYAI NFTs specifically for a user
	 */
	async getUserCyaiNFTs(walletAddress: string): Promise<NFTMetadata[]> {
		try {
			const cyaiNFTs = await this.walletService.getCyreneAINFTs(walletAddress);

			return cyaiNFTs.map((nft: any) => ({
				mint: nft.mintAddress,
				name: nft.name || 'Unnamed CYAI NFT',
				symbol: 'CYAI',
				description: nft.description || '',
				image: nft.image || '',
				collection: {
					name: NFTService.CYAI_COLLECTION_NAME,
					verified: true
				},
				attributes: nft.attributes || [],
				properties: {
					category: 'pfp'
				}
			}));
		} catch (error) {
			console.error(`Error fetching CYAI NFTs for ${walletAddress}:`, error);
			return [];
		}
	}

	/**
	 * Get collection information
	 */
	async getCollectionInfo(collectionSymbol: string): Promise<NFTCollection | null> {
		try {
			const response = await fetch(
				`https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}`
			);
			if (!response.ok) return null;

			const collection = await response.json();
			return {
				symbol: collection.symbol,
				name: collection.name,
				description: collection.description,
				image: collection.image,
				isVerified: collection.verified || false,
				isCyai:
					collection.symbol.toLowerCase().includes('cyai') ||
					collection.name.toLowerCase().includes('cyreneai')
			};
		} catch (error) {
			console.error(`Error fetching collection info for ${collectionSymbol}:`, error);
			return null;
		}
	}

	/**
	 * Get marketplace URL for an NFT
	 */
	getMarketplaceUrl(mint: string, marketplace: 'magiceden' | 'tensor' = 'magiceden'): string {
		switch (marketplace) {
			case 'magiceden':
				return `https://magiceden.io/item-details/${mint}`;
			case 'tensor':
				return `https://www.tensor.trade/item/${mint}`;
			default:
				return `https://magiceden.io/item-details/${mint}`;
		}
	}

	/**
	 * Get collection marketplace URL
	 */
	getCollectionMarketplaceUrl(
		collectionSymbol: string,
		marketplace: 'magiceden' | 'tensor' = 'magiceden'
	): string {
		switch (marketplace) {
			case 'magiceden':
				return `https://magiceden.io/marketplace/${collectionSymbol}`;
			case 'tensor':
				return `https://www.tensor.trade/trade/${collectionSymbol}`;
			default:
				return `https://magiceden.io/marketplace/${collectionSymbol}`;
		}
	}
}
