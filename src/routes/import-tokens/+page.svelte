<script lang='ts'>
	import { ArrowLeft, Plus, Search } from "@lucide/svelte";
	import { walletAddress } from '../../store/store';
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
	import Toast from "$lib/components/ui/toast.svelte";

	let address = $state('');
	let searchQuery = $state('');
	let customTokenAddress = $state('');
	let showAddCustom = $state(false);
	let error = $state('');
	let success = $state('');
	let showToast = $state(false);
	let toastType = $state<'success' | 'error' | 'info'>('info');
	let toastMessage = $state('');
	let rpcUrl = $state<'mainnet' | 'testnet'>('mainnet');

	// Load saved network preference
	$effect(() => {
		const savedNetwork = localStorage.getItem('selected-network') as 'mainnet' | 'testnet';
		if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
			rpcUrl = savedNetwork;
		}
	});

	let walletService = $derived(new SolanaWalletService(rpcUrl));

	walletAddress.subscribe((value) => address = value);

	// Toast helper function
	function showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 4000);
	}

	// Auto-hide toast effect
	$effect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				showToast = false;
			}, 4000);
			return () => clearTimeout(timer);
		}
	});

// Real token search state
let searchedToken = $state<{
	mint: string;
	symbol: string;
	name: string;
	decimals: number;
} | null>(null);
let isSearching = $state(false);
let popularTokens = $state<any[]>([]);
let isLoadingPopularTokens = $state(false);

// Fetch real popular tokens from Solana token registry
async function fetchPopularTokens() {
  try {
    isLoadingPopularTokens = true;
    const registryUrl = `https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json`;
    const registryResponse = await fetch(registryUrl);
    const registry = await registryResponse.json();
    
    // Get the most popular tokens by filtering well-known mints
    const popularMints = [
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
      'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', // mSOL
      'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', // JitoSOL
      'So11111111111111111111111111111111111111112', // Wrapped SOL
      'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
      'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', // PYTH
      'SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y', // SHDW
      'hntyVP6YFm1Hg25TN9WGLqM12b1TQygdWZhLXeHFTDu', // HNT
    ];
    
    const popularTokensData = registry.tokens.filter((token: any) => 
      popularMints.includes(token.address)
    ).map((token: any) => ({
      mint: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals
    }));
    
    popularTokens = popularTokensData;
    console.log('Fetched popular tokens:', popularTokensData);
  } catch (error) {
    console.error('Error fetching popular tokens:', error);
    // Fallback to hardcoded list
    popularTokens = [
      {
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6
      },
      {
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6
      },
      {
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        symbol: 'BONK',
        name: 'Bonk',
        decimals: 5
      }
    ];
  } finally {
    isLoadingPopularTokens = false;
  }
}

// Load popular tokens on component mount
$effect(() => {
  fetchPopularTokens();
});

// Add CYAI and CYRENE tokens (real CYAI address)
const netsepio_tokens = [
	{
		mint: '6Tph3SxbAW12BSJdCevVV9Zujh97X69d5MJ4XjwKmray', // Real CYAI token mint
		symbol: 'CYAI',
		name: 'CyreneAI',
		decimals: 9,
		type: 'token' as const
	},
	{
		mint: 'CYRENETokenMintAddressHere', // Replace with actual CYRENE token mint
		symbol: 'CYRENE',
		name: 'Cyrene Token',
		decimals: 9,
		type: 'token' as const
	}
];

// NFT Collections
const netsepio_nft_collections = [
	{
		mint: 'cyreneai_cosmic_journey', // This is actually the collection symbol
		symbol: 'CYAI NFT',
		name: 'CyreneAI Cosmic Journey',
		decimals: 0,
		type: 'nft_collection' as const,
		collectionSymbol: 'cyreneai_cosmic_journey'
	}
];

	function goBack() {
		window.history.back();
	}


async function handleSearch() {
  searchedToken = null;
  if (!searchQuery.trim()) {
	showToastMessage('Please enter a token mint address to search.', 'error');
	return;
  }
  if (searchQuery.length < 32 || searchQuery.length > 44) {
	showToastMessage('Invalid token mint address format.', 'error');
	return;
  }
  try {
	isSearching = true;
	// Use Helius endpoint for better performance
	const endpoint = walletService.getConnection().rpcEndpoint;
	const metaRes = await fetch(endpoint, {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		method: 'getAccountInfo',
		params: [searchQuery.trim(), { encoding: 'jsonParsed' }]
	  })
	});
	const metaData = await metaRes.json();
	if (!metaData.result?.value?.data?.parsed?.info) throw new Error('Token not found');
	const info = metaData.result.value.data.parsed.info;
	searchedToken = {
	  mint: searchQuery.trim(),
	  symbol: info.symbol || '',
	  name: info.name || '',
	  decimals: info.decimals || 0
	};
	showToastMessage('Token found! You can now add it to your wallet.', 'success');
  } catch (e) {
	showToastMessage(e instanceof Error ? e.message : 'Token not found.', 'error');
	searchedToken = null;
  } finally {
	isSearching = false;
  }
}

async function addToken(token: any) {
  if (!token || !token.mint) {
    showToastMessage('Invalid token data', 'error');
    return;
  }
  
  try {
    // Check if token already exists for this wallet
    const existingTokens = await walletService.getImportedTokensForWallet(address);
    const exists = existingTokens.find(t => t.mint === token.mint);
    
    if (exists) {
      showToastMessage(`${token.symbol || 'Token'} is already in your wallet`, 'error');
      return;
    }
    
    // Add token to wallet service storage for this specific wallet
    await walletService.addImportedTokenToWallet({
      mint: token.mint,
      symbol: token.symbol || 'Unknown',
      name: token.name || 'Unknown Token',
      decimals: token.decimals || 9,
      type: token.type || 'token',
      collectionSymbol: token.collectionSymbol
    }, address);
    
    showToastMessage(`${token.symbol || token.name || 'Token'} has been added to your wallet!`, 'success');
    searchedToken = null;
    searchQuery = '';
    
    // Dispatch custom event to notify wallet page to refresh
    window.dispatchEvent(new CustomEvent('tokensUpdated', { detail: { token } }));
    
    console.log('Token added successfully to wallet:', address, token);
  } catch (e) {
    console.error('Error adding token:', e);
    showToastMessage('Failed to add token. Please try again.', 'error');
  }
}

async function checkCollectionStats() {
  if (!searchQuery.trim()) return;
  
  try {
    isSearching = true;
    const collectionStats = await walletService.fetchNFTCollectionData(searchQuery.trim());
    
    if (collectionStats) {
      // Display collection stats
      console.log('Collection stats:', collectionStats);
      success = `Collection "${searchQuery}" found! Floor price: ${collectionStats.floorPrice / 1000000} SOL`;
      error = '';
    } else {
      error = 'Collection not found or no data available.';
      success = '';
    }
  } catch (e) {
    error = 'Failed to fetch collection data.';
    success = '';
  } finally {
    isSearching = false;
  }
}

async function addCustomToken() {
  const tokenAddress = customTokenAddress.trim();
  if (!tokenAddress) {
    showToastMessage('Please enter a token mint address', 'error');
    return;
  }
  
  // Basic validation for Solana address format
  if (!SolanaWalletService.isValidAddress(tokenAddress)) {
    showToastMessage('Invalid token mint address format', 'error');
    return;
  }
  
  try {
    // Check if token already exists for this wallet
    const existingTokens = await walletService.getImportedTokensForWallet(address);
    const exists = existingTokens.find(t => t.mint === tokenAddress);
    
    if (exists) {
      showToastMessage('Token is already in your wallet', 'error');
      return;
    }
    
    // Add as unknown token - metadata will be fetched later
    await walletService.addImportedTokenToWallet({
      mint: tokenAddress,
      symbol: 'Unknown',
      name: 'Unknown Token',
      decimals: 9
    }, address);
    
    showToastMessage('Custom token added to your wallet! Token details will be fetched when displayed.', 'success');
    customTokenAddress = '';
    showAddCustom = false;
    
    // Dispatch custom event to notify wallet page to refresh
    window.dispatchEvent(new CustomEvent('tokensUpdated', { detail: { token: { mint: tokenAddress } } }));
    
    console.log('Custom token added to wallet:', address, tokenAddress);
  } catch (e) {
    console.error('Error adding custom token:', e);
    showToastMessage('Failed to add custom token. Please try again.', 'error');
  }
}
</script>

<section class="h-[600px] max-h-[600px] overflow-hidden pt-4 pb-4 px-4 bg-[#101212] text-white relative flex flex-col">
	<div class="flex items-center gap-4 mb-4 flex-shrink-0">
		<button onclick={goBack} class="p-2 hover:bg-[#202222] rounded-lg transition-colors">
			<ArrowLeft size="20" />
		</button>
		<h1 class="text-xl font-bold">Import Tokens</h1>
	</div>

<div class="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
		<!-- Wallet Info -->
		<div class="bg-[#202222] rounded-lg p-3">
			<div class="flex items-center gap-2 mb-2">
				<span class="size-2 rounded-full bg-green-500"></span>
				<span class="text-sm">Wallet: {formatWalletAddress(address)}</span>
			</div>
			<p class="text-xs text-gray-400">
				Adding tokens will create associated token accounts when you receive them.
			</p>
		</div>

		<!-- Search -->
	<div class="relative flex gap-2 items-center">
	  <Search size="16" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
	  <input
		type="text"
		bind:value={searchQuery}
		placeholder="Enter token mint address..."
		class="w-full pl-10 pr-4 py-2 bg-[#202222] border border-gray-600 rounded-lg focus:border-[#00ccba] focus:outline-none text-white"
		onkeydown={(e) => { if (e.key === 'Enter') handleSearch(); }}
	  />
	  <button class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-2 px-4 rounded-lg transition-colors text-sm" onclick={handleSearch} disabled={isSearching}>
		{isSearching ? 'Searching...' : 'Search'}
	  </button>
	</div>

		<!-- Add Custom Token Button -->
		<button
			onclick={() => showAddCustom = !showAddCustom}
			class="w-full bg-[#303333] hover:bg-[#404444] border border-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
		>
			<Plus size="16" />
			Add Custom Token
		</button>

		{#if showAddCustom}
			<div class="bg-[#202222] rounded-lg p-4 space-y-4">
				<h3 class="font-semibold">Add Custom Token</h3>
				<input
					type="text"
					bind:value={customTokenAddress}
					placeholder="Enter token mint address"
					class="w-full p-3 bg-[#303333] border border-gray-600 rounded-lg focus:border-[#00ccba] focus:outline-none text-white"
				/>
				<div class="flex gap-2">
					<button
						onclick={() => showAddCustom = false}
						class="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
					>
						Cancel
					</button>
					<button
						onclick={addCustomToken}
						class="flex-1 bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-2 px-4 rounded-lg transition-colors"
					>
						Add Token
					</button>
				</div>
			</div>
		{/if}

	<!-- Real Token Search Result -->
	{#if searchedToken}
	  <div class="bg-[#202222] rounded-lg p-4 flex flex-col gap-2">
		<div class="flex items-center gap-2">
		  <div class="size-8 bg-[#303333] rounded-full flex items-center justify-center">
			<span class="text-base">🪙</span>
		  </div>
		  <div>
			<div class="flex items-center gap-2">
			  <h4 class="font-semibold">{searchedToken.symbol || 'Unknown'}</h4>
			</div>
			<p class="text-sm text-gray-400">{searchedToken.name || 'Unknown Token'}</p>
			<p class="text-xs text-gray-500 truncate max-w-[100px]">{searchedToken.mint}</p>
			<p class="text-xs text-gray-500">Decimals: {searchedToken.decimals}</p>
		  </div>
		</div>
		<button
		  onclick={() => addToken(searchedToken)}
		  class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-2 px-4 rounded-lg transition-colors text-sm mt-2"
		>
		  Add
		</button>
	  </div>
	{/if}

	<!-- CYAI & Ecosystem Tokens -->
	<div class="bg-[#202222] rounded-lg p-4">
		<h3 class="font-semibold text-[#00ccba] mb-3">CYAI & Ecosystem Tokens</h3>
		<div class="space-y-2">
			{#each netsepio_tokens as token}
				<div class="flex items-center justify-between p-2 bg-[#303333] rounded-lg">
					<div class="flex items-center gap-2">
						<div class="size-8 bg-[#00ccba] rounded-full flex items-center justify-center">
							<span class="text-black text-xs font-bold">{token.symbol.charAt(0)}</span>
						</div>
						<div>
							<h4 class="font-semibold text-sm">{token.symbol}</h4>
							<p class="text-xs text-gray-400">{token.name}</p>
						</div>
					</div>
					<button
						onclick={() => addToken(token)}
						class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-1 px-3 rounded-lg transition-colors text-xs"
					>
						Add
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Import NFT Collections -->
	<div class="bg-[#202222] rounded-lg p-4">
		<h3 class="font-semibold text-[#00ccba] mb-3">Import NFT Collections</h3>
		<p class="text-xs text-gray-400 mb-3">Track your NFT collections to view them in your wallet</p>
		<div class="space-y-2">
			{#each netsepio_nft_collections as collection}
				<div class="flex items-center justify-between p-2 bg-[#303333] rounded-lg">
					<div class="flex items-center gap-2">
						<div class="size-8 bg-gradient-to-r from-[#00ccba] to-[#00eeda] rounded-full flex items-center justify-center">
							<span class="text-black text-xs font-bold">🎨</span>
						</div>
						<div>
							<h4 class="font-semibold text-sm">{collection.symbol}</h4>
							<p class="text-xs text-gray-400">{collection.name}</p>
							<p class="text-xs text-gray-500">NFT Collection</p>
						</div>
					</div>
					<button
						onclick={() => addToken(collection)}
						class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-1 px-3 rounded-lg transition-colors text-xs"
					>
						Import
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Popular Tokens -->
	<div class="bg-[#202222] rounded-lg p-4">
		<h3 class="font-semibold mb-3">Popular Tokens</h3>
		{#if isLoadingPopularTokens}
			<div class="text-center py-4">
				<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00ccba] mx-auto"></div>
				<p class="mt-2 text-xs text-gray-400">Loading popular tokens...</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each popularTokens as token}
					<div class="flex items-center justify-between p-2 bg-[#303333] rounded-lg">
						<div class="flex items-center gap-2">
							<div class="size-8 bg-[#404040] rounded-full flex items-center justify-center">
								<span class="text-[#00ccba] text-xs font-bold">{token.symbol.charAt(0)}</span>
							</div>
							<div>
								<h4 class="font-semibold text-sm">{token.symbol}</h4>
								<p class="text-xs text-gray-400">{token.name}</p>
							</div>
						</div>
						<button
							onclick={() => addToken(token)}
							class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-1 px-3 rounded-lg transition-colors text-xs"
						>
							Add
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	</div>
</section>

<Toast
  status={toastMessage}
  success={toastType === 'success'}
  error={toastType === 'error'}
  open={showToast}
/>