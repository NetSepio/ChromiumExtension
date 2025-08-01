// Standalone NFT Service for static HTML pages
// This is a simplified version of the main NFT service that doesn't rely on SvelteKit imports

class StaticNFTService {
	constructor(network = 'mainnet') {
		this.network = network;
		this.CYAI_COLLECTION_SYMBOL = 'cyreneai_cosmic_journey';
		this.CYAI_COLLECTION_NAME = 'CyreneAI Cosmic Journey';

		// API endpoints - API keys should be passed in or retrieved from environment
		this.magicEdenBaseUrl = 'https://api-mainnet.magiceden.dev/v2';

		// Get API key from environment or use demo key as fallback
		this.heliusApiKey = this.getHeliusApiKey();
		this.heliusUrl =
			network === 'mainnet'
				? `https://mainnet.helius-rpc.com/?api-key=${this.heliusApiKey}`
				: `https://devnet.helius-rpc.com/?api-key=${this.heliusApiKey}`;
		this.jupiterUrl = 'https://price.jup.ag/v6';
	}

	/**
	 * Get Helius API key from environment or storage
	 */
	getHeliusApiKey() {
		// Try to get from environment first (injected by Vite build process)
		if (typeof process !== 'undefined' && process.env && process.env.HELIUS_API_KEY) {
			console.log('Using Helius API key from environment');
			return process.env.HELIUS_API_KEY;
		}

		// Check if running in development and warn about demo key
		console.warn(
			'No HELIUS_API_KEY found in environment - using demo key with limited functionality'
		);
		console.warn('Please ensure HELIUS_API_KEY is set in your .env file');

		// Fallback to demo key (limited functionality)
		return 'demo-key';
	}

	/**
	 * Update API key and URLs (for when key is retrieved from storage)
	 */
	updateApiKey(apiKey) {
		this.heliusApiKey = apiKey;
		this.heliusUrl =
			this.network === 'mainnet'
				? `https://mainnet.helius-rpc.com/?api-key=${this.heliusApiKey}`
				: `https://devnet.helius-rpc.com/?api-key=${this.heliusApiKey}`;
	}

	/**
	 * Initialize API key from Chrome storage if available
	 */
	async initializeApiKey() {
		// First try to get from Chrome storage
		if (typeof chrome !== 'undefined' && chrome.storage) {
			try {
				const result = await chrome.storage.local.get(['heliusApiKey']);
				if (result.heliusApiKey && result.heliusApiKey !== 'demo-key') {
					this.updateApiKey(result.heliusApiKey);
					return;
				}
			} catch (error) {
				console.log('Could not retrieve API key from storage:', error);
			}
		}

		// If not found in storage, check if we have it from build process
		if (this.heliusApiKey === 'demo-key') {
			console.log('Using demo API key - some features may be limited');
		}
	}

	/**
	 * Get trending NFT collections from Magic Eden with Helius fallback
	 */
	async getTrendingCollections(limit = 20) {
		try {
			// Try Magic Eden first (but with longer delays to avoid rate limiting)
			const magicEdenData = await this.getTrendingFromMagicEden(limit);
			if (magicEdenData && magicEdenData.length > 0) {
				console.log(`Magic Eden returned ${magicEdenData.length} collections`);
				return magicEdenData;
			}

			// Fallback to Helius only if we have a real API key
			if (this.heliusApiKey !== 'demo-key') {
				console.log('Magic Eden unavailable, trying Helius...');
				const heliusData = await this.getTrendingFromHelius(limit);
				if (heliusData && heliusData.length > 0) {
					console.log(`Helius returned ${heliusData.length} collections`);
					return heliusData;
				}
			}

			// Final fallback to static data
			console.log('All APIs unavailable, using fallback data');
			const fallbackData = await this.getFallbackCollections();
			console.log(`Fallback data: ${fallbackData.length} collections`);
			return fallbackData;
		} catch (error) {
			console.error('Error fetching trending collections:', error);
			return await this.getFallbackCollections();
		}
	}

	/**
	 * Get trending collections from Magic Eden
	 */
	async getTrendingFromMagicEden(limit = 20) {
		try {
			// Add even longer delay to prevent rate limiting
			await this.sleep(8000); // Increased to 8 seconds

			const response = await fetch(`${this.magicEdenBaseUrl}/collections/stats`);

			if (response.status === 429) {
				console.warn('Magic Eden API rate limited');
				return null;
			}

			if (!response.ok) {
				console.warn(`Magic Eden API returned ${response.status}`);
				return null;
			}

			const collections = await response.json();

			const trending = collections.slice(0, limit).map((collection) => ({
				symbol: collection.symbol,
				name: collection.name || collection.symbol,
				image: collection.image,
				floorPrice: collection.floorPrice ? collection.floorPrice / 1000000000 : 0,
				floorChange24h: collection.floorPriceChange24h || 0,
				volume24h: collection.volumeAll ? collection.volumeAll / 1000000000 : 0,
				volumeChange24h: collection.volumeChange24h || 0,
				listedCount: collection.listedCount || 0,
				owners: collection.uniqueHolders || 0,
				supply: collection.totalItems || 0,
				verified: collection.verified || false,
				source: 'magiceden'
			}));

			// Prioritize CYAI collection
			const cyaiIndex = trending.findIndex(
				(c) =>
					c.symbol.toLowerCase().includes('cyai') ||
					c.name.toLowerCase().includes('cyreneai') ||
					c.symbol === this.CYAI_COLLECTION_SYMBOL
			);

			if (cyaiIndex === -1) {
				const cyaiCollection = await this.getCyaiCollectionStats();
				if (cyaiCollection) {
					trending.unshift(cyaiCollection);
				}
			} else if (cyaiIndex > 2) {
				const cyai = trending.splice(cyaiIndex, 1)[0];
				trending.splice(2, 0, cyai);
			}

			return trending;
		} catch (error) {
			console.error('Error fetching from Magic Eden:', error);
			return null;
		}
	}

	/**
	 * Get trending collections from Helius
	 */
	async getTrendingFromHelius(limit = 20) {
		try {
			await this.sleep(500);

			// Use Helius DAS API to get popular collections
			const response = await fetch(this.heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAssetsByGroup',
					params: {
						groupKey: 'collection',
						groupValue: '',
						page: 1,
						limit: limit,
						sortBy: {
							sortBy: 'recent_action',
							sortDirection: 'desc'
						}
					}
				})
			});

			if (!response.ok) {
				console.warn('Helius API unavailable');
				return null;
			}

			const data = await response.json();
			if (!data.result || !data.result.items) {
				return null;
			}

			// Transform Helius data to our format
			const collectionMap = new Map();

			data.result.items.forEach((asset) => {
				if (asset.grouping && asset.grouping.length > 0) {
					const collection = asset.grouping.find((g) => g.group_key === 'collection');
					if (collection) {
						const collectionId = collection.group_value;
						if (!collectionMap.has(collectionId)) {
							collectionMap.set(collectionId, {
								symbol: collectionId,
								name: asset.content?.metadata?.collection?.name || 'Unknown Collection',
								image: asset.content?.files?.[0]?.uri || '',
								floorPrice: 0, // Helius doesn't provide floor price directly
								floorChange24h: 0,
								volume24h: 0,
								volumeChange24h: 0,
								listedCount: 0,
								owners: 0,
								supply: 0,
								verified: asset.content?.metadata?.collection?.verified || false,
								source: 'helius'
							});
						}
					}
				}
			});

			return Array.from(collectionMap.values()).slice(0, limit);
		} catch (error) {
			console.error('Error fetching from Helius:', error);
			return null;
		}
	}

	/**
	 * Get CYAI collection stats with fallbacks
	 */
	async getCyaiCollectionStats() {
		try {
			// Add delay to prevent rate limiting
			await this.sleep(500);

			const response = await fetch(
				`${this.magicEdenBaseUrl}/collections/${this.CYAI_COLLECTION_SYMBOL}/stats`
			);

			if (response.status === 429) {
				console.warn('Magic Eden API rate limited for CYAI collection');
				return this.getFallbackCyaiStats();
			}

			if (!response.ok) {
				console.warn('CYAI collection not found on Magic Eden, trying Helius...');
				return await this.getCyaiStatsFromHelius();
			}

			const stats = await response.json();
			return {
				symbol: this.CYAI_COLLECTION_SYMBOL,
				name: this.CYAI_COLLECTION_NAME,
				image: stats.image || '',
				floorPrice: (stats.floorPrice || 0) / 1000000000,
				floorChange24h: stats.floorPriceChange24h || 0,
				volume24h: (stats.volumeAll || 0) / 1000000000,
				volumeChange24h: stats.volumeChange24h || 0,
				listedCount: stats.listedCount || 0,
				owners: stats.uniqueHolders || 0,
				supply: stats.totalItems || 0,
				verified: true,
				source: 'magiceden'
			};
		} catch (error) {
			console.error('Error fetching CYAI collection stats:', error);
			return this.getFallbackCyaiStats();
		}
	}

	/**
	 * Get CYAI stats from Helius
	 */
	async getCyaiStatsFromHelius() {
		try {
			const response = await fetch(this.heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAssetsByGroup',
					params: {
						groupKey: 'collection',
						groupValue: this.CYAI_COLLECTION_SYMBOL,
						page: 1,
						limit: 1
					}
				})
			});

			if (!response.ok) {
				return this.getFallbackCyaiStats();
			}

			const data = await response.json();
			if (data.result && data.result.items && data.result.items.length > 0) {
				const asset = data.result.items[0];
				return {
					symbol: this.CYAI_COLLECTION_SYMBOL,
					name: asset.content?.metadata?.collection?.name || this.CYAI_COLLECTION_NAME,
					image: asset.content?.files?.[0]?.uri || '',
					floorPrice: 0, // Helius doesn't provide floor price directly
					floorChange24h: 0,
					volume24h: 0,
					volumeChange24h: 0,
					listedCount: 0,
					owners: 0,
					supply: data.result.total || 0,
					verified: asset.content?.metadata?.collection?.verified || true,
					source: 'helius'
				};
			}

			return this.getFallbackCyaiStats();
		} catch (error) {
			console.error('Error fetching CYAI stats from Helius:', error);
			return this.getFallbackCyaiStats();
		}
	}

	/**
	 * Get fallback CYAI stats
	 */
	getFallbackCyaiStats() {
		return {
			symbol: this.CYAI_COLLECTION_SYMBOL,
			name: this.CYAI_COLLECTION_NAME,
			image: '',
			floorPrice: 0,
			floorChange24h: 0,
			volume24h: 0,
			volumeChange24h: 0,
			listedCount: 0,
			owners: 0,
			supply: 0,
			verified: true,
			source: 'fallback'
		};
	}

	/**
	 * Search collections by name with multiple API fallbacks
	 */
	async searchCollections(query, limit = 10) {
		try {
			// Try Magic Eden first
			const magicEdenResults = await this.searchWithMagicEden(query, limit);
			if (magicEdenResults && magicEdenResults.length > 0) {
				return magicEdenResults;
			}

			// Fallback to Helius
			console.log('Magic Eden search unavailable, trying Helius...');
			const heliusResults = await this.searchWithHelius(query, limit);
			if (heliusResults && heliusResults.length > 0) {
				return heliusResults;
			}

			// Final fallback to static data
			console.log('All search APIs unavailable, using fallback');
			return await this.getFallbackSearchResults(query, limit);
		} catch (error) {
			console.error('Error searching collections:', error);
			return await this.getFallbackSearchResults(query, limit);
		}
	}

	/**
	 * Search collections using Magic Eden
	 */
	async searchWithMagicEden(query, limit = 10) {
		try {
			// Add delay to prevent rate limiting
			await this.sleep(1000);

			const response = await fetch(
				`${this.magicEdenBaseUrl}/collections?q=${encodeURIComponent(query)}&limit=${limit}`
			);

			if (response.status === 429) {
				console.warn('Magic Eden search API rate limited');
				return null;
			}

			if (!response.ok) {
				console.warn(`Magic Eden search returned ${response.status}`);
				return null;
			}

			const collections = await response.json();

			return collections.map((collection) => ({
				symbol: collection.symbol,
				name: collection.name || collection.symbol,
				description: collection.description,
				image: collection.image,
				floorPrice: collection.floorPrice ? collection.floorPrice / 1000000000 : undefined,
				verified: collection.verified || false,
				source: 'magiceden',
				isCyai:
					collection.symbol.toLowerCase().includes('cyai') ||
					collection.name.toLowerCase().includes('cyreneai')
			}));
		} catch (error) {
			console.error('Error searching with Magic Eden:', error);
			return null;
		}
	}

	/**
	 * Search collections using Helius
	 */
	async searchWithHelius(query, limit = 10) {
		try {
			await this.sleep(500);

			// Search for assets by collection name
			const response = await fetch(this.heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'searchAssets',
					params: {
						query: query,
						page: 1,
						limit: limit * 3, // Get more to filter duplicates
						searchBy: 'collection'
					}
				})
			});

			if (!response.ok) {
				console.warn('Helius search API unavailable');
				return null;
			}

			const data = await response.json();
			if (!data.result || !data.result.items) {
				return null;
			}

			// Transform and deduplicate results
			const collectionMap = new Map();

			data.result.items.forEach((asset) => {
				if (asset.grouping && asset.grouping.length > 0) {
					const collection = asset.grouping.find((g) => g.group_key === 'collection');
					if (collection && asset.content?.metadata?.collection?.name) {
						const collectionName = asset.content.metadata.collection.name;
						const collectionId = collection.group_value;

						// Check if collection name matches query
						if (collectionName.toLowerCase().includes(query.toLowerCase())) {
							if (!collectionMap.has(collectionId)) {
								collectionMap.set(collectionId, {
									symbol: collectionId,
									name: collectionName,
									description: asset.content.metadata.description || '',
									image: asset.content?.files?.[0]?.uri || '',
									floorPrice: undefined, // Helius doesn't provide floor price in search
									verified: asset.content.metadata.collection.verified || false,
									source: 'helius',
									isCyai:
										collectionName.toLowerCase().includes('cyai') ||
										collectionName.toLowerCase().includes('cyreneai')
								});
							}
						}
					}
				}
			});

			return Array.from(collectionMap.values()).slice(0, limit);
		} catch (error) {
			console.error('Error searching with Helius:', error);
			return null;
		}
	}

	/**
	 * Get NFTs from a specific collection with API fallbacks
	 */
	async getCollectionNFTs(collectionSymbol, limit = 20, offset = 0) {
		try {
			// Try Magic Eden idxv2 first (the working endpoint you provided)
			const magicEdenV2NFTs = await this.getCollectionNFTsFromMagicEdenV2(
				collectionSymbol,
				limit,
				offset
			);
			if (magicEdenV2NFTs && magicEdenV2NFTs.length > 0) {
				return magicEdenV2NFTs;
			}

			// Try Magic Eden v2 as fallback
			const magicEdenNFTs = await this.getCollectionNFTsFromMagicEden(
				collectionSymbol,
				limit,
				offset
			);
			if (magicEdenNFTs && magicEdenNFTs.length > 0) {
				return magicEdenNFTs;
			}

			// Fallback to Helius
			console.log('Magic Eden collection API unavailable, trying Helius...');
			const heliusNFTs = await this.getCollectionNFTsFromHelius(collectionSymbol, limit, offset);
			if (heliusNFTs && heliusNFTs.length > 0) {
				return heliusNFTs;
			}

			// Final fallback to demo data
			console.log('All collection APIs unavailable, using fallback NFTs');
			return this.getFallbackCollectionNFTs(collectionSymbol, limit);
		} catch (error) {
			console.error(`Error fetching NFTs for collection ${collectionSymbol}:`, error);
			return this.getFallbackCollectionNFTs(collectionSymbol, limit);
		}
	}

	/**
	 * Get collection NFTs from Magic Eden using idxv2 endpoint
	 */
	async getCollectionNFTsFromMagicEdenV2(collectionSymbol, limit = 20, offset = 0) {
		try {
			await this.sleep(1000); // Rate limiting

			// Use the working idxv2 endpoint you provided
			const response = await fetch(
				`${this.magicEdenBaseUrl}/idxv2/getAllNftsByCollectionSymbol?collectionSymbol=${collectionSymbol}&onChainCollectionAddress=B7YfD2i7v8C2eEnmD6tpsN2jkhtqT4fecBco6EWyP2WM&direction=2&field=4&limit=${limit}&offset=${offset}&token22StandardFilter=1&mplCoreStandardFilter=1&agg=3&compressionMode=both`
			);

			if (response.status === 429) {
				console.warn('Magic Eden idxv2 API rate limited');
				return null;
			}

			if (!response.ok) {
				console.warn(`Magic Eden idxv2 API returned ${response.status}`);
				return null;
			}

			const data = await response.json();
			console.log('Magic Eden idxv2 NFTs data:', data);

			if (!data.results || !Array.isArray(data.results)) {
				console.warn('Invalid response format from Magic Eden idxv2');
				return null;
			}

			return data.results.map((nft) => ({
				mint: nft.id || nft.tokenMint,
				name: nft.name || nft.title || 'Unnamed NFT',
				symbol: collectionSymbol,
				description: nft.description || '',
				image: nft.imageUri || nft.img || nft.image,
				external_url: nft.externalUrl || nft.externalURL,
				collection: {
					name: nft.collectionName || nft.collectionTitle || collectionSymbol,
					verified: nft.verifiedCollectionAddress ? true : false
				},
				attributes: nft.attributes || nft.traits || [],
				floorPrice: nft.price ? nft.price / 1000000000 : undefined,
				properties: {
					creators: nft.creators || []
				},
				source: 'magiceden-idxv2'
			}));
		} catch (error) {
			console.error('Error fetching collection NFTs from Magic Eden idxv2:', error);
			return null;
		}
	}

	/**
	 * Get collection NFTs from Magic Eden
	 */
	async getCollectionNFTsFromMagicEden(collectionSymbol, limit = 20, offset = 0) {
		try {
			// Add delay to prevent rate limiting
			await this.sleep(1000);

			const response = await fetch(
				`${this.magicEdenBaseUrl}/collections/${collectionSymbol}/listings?offset=${offset}&limit=${limit}`
			);

			if (response.status === 429) {
				console.warn('Magic Eden collection API rate limited');
				return null;
			}

			if (!response.ok) {
				console.warn(`Magic Eden collection API returned ${response.status}`);
				return null;
			}

			const nfts = await response.json();

			return nfts.map((nft) => ({
				mint: nft.tokenMint,
				name: nft.title || 'Unnamed NFT',
				symbol: collectionSymbol,
				description: nft.description,
				image: nft.img,
				external_url: nft.externalURL,
				collection: {
					name: nft.collectionTitle || collectionSymbol,
					verified: true
				},
				attributes: nft.attributes || [],
				floorPrice: nft.price ? nft.price / 1000000000 : undefined,
				properties: {
					creators: nft.creators || []
				},
				source: 'magiceden'
			}));
		} catch (error) {
			console.error('Error fetching collection NFTs from Magic Eden:', error);
			return null;
		}
	}

	/**
	 * Get collection NFTs from Helius
	 */
	async getCollectionNFTsFromHelius(collectionSymbol, limit = 20, offset = 0) {
		try {
			await this.sleep(500);

			const response = await fetch(this.heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAssetsByGroup',
					params: {
						groupKey: 'collection',
						groupValue: collectionSymbol,
						page: Math.floor(offset / limit) + 1,
						limit: limit
					}
				})
			});

			if (!response.ok) {
				console.warn('Helius collection API unavailable');
				return null;
			}

			const data = await response.json();
			if (!data.result || !data.result.items) {
				return null;
			}

			return data.result.items.map((asset) => ({
				mint: asset.id,
				name: asset.content?.metadata?.name || 'Unnamed NFT',
				symbol: asset.content?.metadata?.symbol || collectionSymbol,
				description: asset.content?.metadata?.description || '',
				image: asset.content?.files?.[0]?.uri || asset.content?.metadata?.image || '',
				external_url: asset.content?.metadata?.external_url || '',
				collection: {
					name: asset.content?.metadata?.collection?.name || collectionSymbol,
					verified: asset.content?.metadata?.collection?.verified || false
				},
				attributes: asset.content?.metadata?.attributes || [],
				properties: {
					creators: asset.creators || [],
					category: asset.content?.metadata?.properties?.category || 'image'
				},
				source: 'helius'
			}));
		} catch (error) {
			console.error('Error fetching collection NFTs from Helius:', error);
			return null;
		}
	}

	/**
	 * Get NFT metadata by mint address using Helius with enhanced error handling
	 */
	async getNFTMetadata(mint) {
		try {
			// Add delay to prevent rate limiting
			await this.sleep(500);

			const response = await fetch(this.heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAsset',
					params: { id: mint }
				})
			});

			if (response.status === 429) {
				console.warn('Helius API rate limited, using fallback metadata');
				return this.getFallbackNFTMetadata(mint);
			}

			if (!response.ok) {
				console.warn(`Helius API returned ${response.status}, using fallback metadata`);
				return this.getFallbackNFTMetadata(mint);
			}

			const data = await response.json();
			if (!data.result) {
				console.warn('No NFT data found, using fallback metadata');
				return this.getFallbackNFTMetadata(mint);
			}

			const asset = data.result;
			return {
				mint,
				name: asset.content?.metadata?.name || 'Unnamed NFT',
				symbol: asset.content?.metadata?.symbol || '',
				description: asset.content?.metadata?.description || '',
				image: asset.content?.files?.[0]?.uri || asset.content?.metadata?.image || '',
				external_url:
					asset.content?.metadata?.external_url || `https://magiceden.io/item-details/${mint}`,
				collection: asset.grouping?.find((g) => g.group_key === 'collection')
					? {
							name: asset.content?.metadata?.collection?.name || 'Unknown Collection',
							verified: asset.content?.metadata?.collection?.verified || false
						}
					: undefined,
				attributes: asset.content?.metadata?.attributes || [],
				properties: {
					category: asset.content?.metadata?.properties?.category || 'image',
					creators: asset.creators || []
				},
				source: 'helius'
			};
		} catch (error) {
			console.error(`Error fetching NFT metadata for ${mint}:`, error);
			return this.getFallbackNFTMetadata(mint);
		}
	}

	/**
	 * Get SOL price from Jupiter API
	 */
	async getSOLPrice() {
		try {
			const response = await fetch(
				`${this.jupiterUrl}/price?ids=So11111111111111111111111111111111111111112`
			);

			if (!response.ok) {
				console.warn('Jupiter price API unavailable, using fallback');
				return this.getFallbackSOLPrice();
			}

			const data = await response.json();
			const solPrice = data.data?.['So11111111111111111111111111111111111111112']?.price;

			return solPrice ? parseFloat(solPrice) : this.getFallbackSOLPrice();
		} catch (error) {
			console.error('Error fetching SOL price from Jupiter:', error);
			return this.getFallbackSOLPrice();
		}
	}

	/**
	 * Get fallback SOL price
	 */
	getFallbackSOLPrice() {
		// Return a reasonable fallback price
		return 100.0; // $100 USD as fallback
	}

	/**
	 * Get collection information with fallbacks
	 */
	async getCollectionInfo(collectionSymbol) {
		try {
			// Try Magic Eden first with idxv2 endpoint
			const magicEdenInfo = await this.getCollectionInfoFromMagicEdenV2(collectionSymbol);
			if (magicEdenInfo) {
				return magicEdenInfo;
			}

			// Fallback to old v2 endpoint
			const magicEdenInfoV2 = await this.getCollectionInfoFromMagicEden(collectionSymbol);
			if (magicEdenInfoV2) {
				return magicEdenInfoV2;
			}

			// Fallback to Helius
			const heliusInfo = await this.getCollectionInfoFromHelius(collectionSymbol);
			if (heliusInfo) {
				return heliusInfo;
			}

			return null;
		} catch (error) {
			console.error(`Error fetching collection info for ${collectionSymbol}:`, error);
			return null;
		}
	}

	/**
	 * Get collection info from Magic Eden using idxv2 endpoint
	 */
	async getCollectionInfoFromMagicEdenV2(collectionSymbol) {
		try {
			await this.sleep(1000); // Rate limiting

			// First get collection stats
			const statsResponse = await fetch(
				`${this.magicEdenBaseUrl}/collections/${collectionSymbol}/stats`
			);

			if (!statsResponse.ok) {
				console.warn(`Magic Eden stats API returned ${statsResponse.status}`);
				return null;
			}

			const stats = await statsResponse.json();
			console.log('Magic Eden collection stats:', stats);

			return {
				symbol: collectionSymbol,
				name: stats.name || collectionSymbol,
				description: stats.description || '',
				image: stats.image || '',
				floorPrice: stats.floorPrice ? stats.floorPrice / 1000000000 : undefined,
				listedCount: stats.listedCount || 0,
				volume24h: stats.volumeAll ? stats.volumeAll / 1000000000 : undefined,
				owners: stats.uniqueHolders || 0,
				supply: stats.totalItems || 0,
				verified: stats.verified || false,
				source: 'magiceden-v2',
				isCyai:
					collectionSymbol.toLowerCase().includes('cyai') ||
					stats.name?.toLowerCase().includes('cyreneai')
			};
		} catch (error) {
			console.error(
				`Error fetching collection info from Magic Eden V2 for ${collectionSymbol}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get collection info from Magic Eden
	 */
	async getCollectionInfoFromMagicEden(collectionSymbol) {
		try {
			const response = await fetch(`${this.magicEdenBaseUrl}/collections/${collectionSymbol}`);

			if (!response.ok) return null;

			const collection = await response.json();
			return {
				symbol: collection.symbol,
				name: collection.name || collection.symbol,
				description: collection.description,
				image: collection.image,
				floorPrice: collection.floorPrice ? collection.floorPrice / 1000000000 : undefined,
				listedCount: collection.listedCount,
				volume24h: collection.volumeAll ? collection.volumeAll / 1000000000 : undefined,
				owners: collection.uniqueHolders,
				supply: collection.totalItems,
				verified: collection.verified || false,
				source: 'magiceden',
				isCyai:
					collection.symbol.toLowerCase().includes('cyai') ||
					collection.name.toLowerCase().includes('cyreneai')
			};
		} catch (error) {
			console.error(
				`Error fetching collection info from Magic Eden for ${collectionSymbol}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get collection info from Helius
	 */
	async getCollectionInfoFromHelius(collectionSymbol) {
		try {
			const response = await fetch(this.heliusUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAssetsByGroup',
					params: {
						groupKey: 'collection',
						groupValue: collectionSymbol,
						page: 1,
						limit: 1
					}
				})
			});

			if (!response.ok) return null;

			const data = await response.json();
			if (!data.result || !data.result.items || data.result.items.length === 0) {
				return null;
			}

			const asset = data.result.items[0];
			return {
				symbol: collectionSymbol,
				name: asset.content?.metadata?.collection?.name || collectionSymbol,
				description: asset.content?.metadata?.description || '',
				image: asset.content?.files?.[0]?.uri || '',
				floorPrice: undefined, // Helius doesn't provide floor price
				listedCount: 0,
				volume24h: undefined,
				owners: 0,
				supply: data.result.total || 0,
				verified: asset.content?.metadata?.collection?.verified || false,
				source: 'helius',
				isCyai:
					asset.content?.metadata?.collection?.name?.toLowerCase().includes('cyai') ||
					asset.content?.metadata?.collection?.name?.toLowerCase().includes('cyreneai')
			};
		} catch (error) {
			console.error(`Error fetching collection info from Helius for ${collectionSymbol}:`, error);
			return null;
		}
	}

	/**
	 * Get user's NFTs from Chrome storage
	 */
	async getUserNFTs(walletAddress) {
		try {
			if (typeof chrome !== 'undefined' && chrome.storage) {
				const result = await chrome.storage.local.get([`userNFTs_${walletAddress}`]);
				return result[`userNFTs_${walletAddress}`] || [];
			}
			return [];
		} catch (error) {
			console.error(`Error fetching user NFTs for ${walletAddress}:`, error);
			return [];
		}
	}

	/**
	 * Fallback collections when API fails
	 */
	async getFallbackCollections() {
		const cyaiCollection = await this.getCyaiCollectionStats();

		// Provide popular fallback collections with reliable placeholder images
		const fallbackCollections = [
			{
				symbol: 'degods',
				name: 'DeGods',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2N2VhIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjMwIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iODUiIGN5PSI3NSIgcj0iNSIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjExNSIgY3k9Ijc1IiByPSI1IiBmaWxsPSIjMzMzIi8+PGVsbGlwc2UgY3g9IjEwMCIgY3k9Ijk1IiByeD0iMTUiIHJ5PSI4IiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iMTAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGVHb2RzPC90ZXh0Pjwvc3ZnPg==',
				floorPrice: 15.2,
				floorChange24h: -2.1,
				volume24h: 892.1,
				volumeChange24h: 5.2,
				listedCount: 234,
				owners: 8567,
				supply: 10000,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'okay_bears',
				name: 'Okay Bears',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY5NTAwIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjM1IiBmaWxsPSIjOGI0NTEzIi8+PGNpcmNsZSBjeD0iODAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9IiM4YjQ1MTMiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9IiM4YjQ1MTMiLz48Y2lyY2xlIGN4PSI4NSIgY3k9Ijc1IiByPSI0IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTE1IiBjeT0iNzUiIHI9IjQiIGZpbGw9IiMwMDAiLz48ZWxsaXBzZSBjeD0iMTAwIiBjeT0iOTAiIHJ4PSI4IiByeT0iNSIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjEwMCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9rYXkgQmVhcnM8L3RleHQ+PC9zdmc+',
				floorPrice: 8.7,
				floorChange24h: 5.8,
				volume24h: 445.6,
				volumeChange24h: -1.2,
				listedCount: 156,
				owners: 6789,
				supply: 10000,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'mad_lads',
				name: 'Mad Lads',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTMzM2VhIi8+PHJlY3QgeD0iNzAiIHk9IjUwIiB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHJ4PSI1IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iODUiIGN5PSI3NSIgcj0iNSIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjExNSIgY3k9Ijc1IiByPSI1IiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iOTAiIHk9IjkwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NYWQgTGFkczwvdGV4dD48L3N2Zz4=',
				floorPrice: 125.5,
				floorChange24h: 12.3,
				volume24h: 2156.8,
				volumeChange24h: 8.9,
				listedCount: 89,
				owners: 9234,
				supply: 10000,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'smb_gen2',
				name: 'SMB Gen2',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDBjY2JhIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9Ijg1IiB5PSI4NSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMDBjY2JhIi8+PGNpcmNsZSBjeD0iOTAiIGN5PSI5MCIgcj0iMyIgZmlsbD0iIzAwMCIvPjxjaXJjbGUgY3g9IjExMCIgY3k9IjkwIiByPSIzIiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iMTAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U01CIEdlbjI8L3RleHQ+PC9zdmc+',
				floorPrice: 4.2,
				floorChange24h: 3.1,
				volume24h: 234.5,
				volumeChange24h: 12.4,
				listedCount: 567,
				owners: 4321,
				supply: 5000,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'famous_fox_federation',
				name: 'Famous Fox Federation',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PGVsbGlwc2UgY3g9IjEwMCIgY3k9IjkwIiByeD0iNDAiIHJ5PSIzNSIgZmlsbD0iI2Y5N2ZkMiIvPjx0cmlhbmdsZSBwb2ludHM9IjEwMCw2MCA4NSw4NSAxMTUsODUiIGZpbGw9IiNlZjQ0NDQiLz48Y2lyY2xlIGN4PSI4NSIgY3k9Ijc1IiByPSI0IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTE1IiBjeT0iNzUiIHI9IjQiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYW1vdXMgRm94PC90ZXh0Pjwvc3ZnPg==',
				floorPrice: 2.8,
				floorChange24h: -1.2,
				volume24h: 156.7,
				volumeChange24h: -5.3,
				listedCount: 234,
				owners: 6543,
				supply: 7777,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'y00ts',
				name: 'y00ts',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+eTA8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+eTAwdHM8L3RleHQ+PC9zdmc+',
				floorPrice: 18.4,
				floorChange24h: 7.3,
				volume24h: 567.2,
				volumeChange24h: 14.1,
				listedCount: 89,
				owners: 5432,
				supply: 15000,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'solana_monkey_business',
				name: 'Solana Monkey Business',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGMyNmI1Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjM1IiBmaWxsPSIjZmZkNzAwIi8+PGNpcmNsZSBjeD0iODAiIGN5PSI2NSIgcj0iMTIiIGZpbGw9IiNmZmQ3MDAiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSI2NSIgcj0iMTIiIGZpbGw9IiNmZmQ3MDAiLz48Y2lyY2xlIGN4PSI4NSIgY3k9Ijc1IiByPSI0IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTE1IiBjeT0iNzUiIHI9IjQiIGZpbGw9IiMwMDAiLz48ZWxsaXBzZSBjeD0iMTAwIiBjeT0iOTAiIHJ4PSIxMiIgcnk9IjgiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Tb2xhbmEgTW9ua2V5PC90ZXh0Pjwvc3ZnPg==',
				floorPrice: 1.2,
				floorChange24h: -3.4,
				volume24h: 45.3,
				volumeChange24h: -8.7,
				listedCount: 345,
				owners: 2876,
				supply: 5000,
				verified: true,
				source: 'fallback'
			},
			{
				symbol: 'saga',
				name: 'Saga',
				image:
					'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGY3MmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMDAsNDAgMTQwLDgwIDEwMCwxMjAgNjAsODAiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiMwZjcyZmYiLz48dGV4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYWdhPC90ZXh0Pjwvc3ZnPg==',
				floorPrice: 0.85,
				floorChange24h: 2.1,
				volume24h: 23.4,
				volumeChange24h: 6.8,
				listedCount: 456,
				owners: 1987,
				supply: 2500,
				verified: true,
				source: 'fallback'
			}
		];

		if (cyaiCollection) {
			return [cyaiCollection, ...fallbackCollections];
		}

		return fallbackCollections;
	}

	/**
	 * Get fallback NFT metadata when API is rate limited
	 */
	getFallbackNFTMetadata(mint) {
		return {
			mint: mint,
			name: `Demo NFT ${mint.slice(-6)}`,
			symbol: 'DEMO',
			description: 'Demo NFT metadata when API is unavailable',
			image: `https://cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://metadata.degods.com/g/1.png`,
			external_url: `https://magiceden.io/item-details/${mint}`,
			collection: {
				name: 'Demo Collection',
				verified: false
			},
			attributes: [
				{ trait_type: 'Background', value: 'Blue' },
				{ trait_type: 'Type', value: 'Demo' },
				{ trait_type: 'Rarity', value: 'Common' }
			],
			properties: {
				creators: [],
				category: 'image'
			},
			seller_fee_basis_points: 500
		};
	}

	/**
	 * Utility function to check if NFT is CYAI
	 */
	isCyaiNFT(nft) {
		return (
			nft.collection?.name?.toLowerCase().includes('cyreneai') ||
			nft.symbol?.toLowerCase().includes('cyai') ||
			nft.name?.toLowerCase().includes('cyai')
		);
	}

	/**
	 * Get fallback search results when API is rate limited
	 */
	async getFallbackSearchResults(query, limit = 10) {
		const fallbackCollections = await this.getFallbackCollections();
		const filtered = fallbackCollections.filter(
			(collection) =>
				collection.name.toLowerCase().includes(query.toLowerCase()) ||
				collection.symbol.toLowerCase().includes(query.toLowerCase())
		);
		return filtered.slice(0, limit);
	}

	/**
	 * Get fallback NFTs for a specific collection
	 */
	getFallbackCollectionNFTs(collectionSymbol, limit = 20) {
		// Return demo NFTs for the collection
		const demoNFTs = [];
		for (let i = 1; i <= Math.min(limit, 5); i++) {
			demoNFTs.push({
				mint: `${collectionSymbol}-demo-${i}`,
				name: `${collectionSymbol} #${i}`,
				symbol: collectionSymbol,
				description: `Demo NFT from ${collectionSymbol} collection`,
				image: `https://cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://metadata.degods.com/g/${i}.png`,
				collection: {
					name: collectionSymbol,
					verified: true
				},
				attributes: [
					{ trait_type: 'Background', value: 'Blue' },
					{ trait_type: 'Rarity', value: 'Common' }
				],
				floorPrice: 0.5 + i * 0.1,
				properties: {
					creators: []
				}
			});
		}
		return demoNFTs;
	}

	/**
	 * Utility function to add delay between API calls
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Utility function to format price
	 */
	formatPrice(price) {
		if (!price || price < 0.01) return '< 0.01 SOL';
		return `${price.toFixed(2)} SOL`;
	}

	/**
	 * Utility function to format percentage change
	 */
	formatChange(change) {
		const sign = change >= 0 ? '+' : '';
		return `${sign}${change.toFixed(1)}%`;
	}
}

// Export for use in static HTML pages
window.StaticNFTService = StaticNFTService;
