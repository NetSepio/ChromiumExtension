<script lang="ts">
	import { ArrowLeft, Plus, Search } from '@lucide/svelte';
	import { walletAddress } from '../../store/store';
	import { formatWalletAddress } from '$lib/helpers/formatWalletAddress';
	import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
	import Toast from '$lib/components/ui/toast.svelte';

	let address = $state('');
	let searchQuery = $state('');
	let customTokenAddress = $state('');
	let showAddCustom = $state(false);
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

	walletAddress.subscribe((value) => (address = value));

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
				'hntyVP6YFm1Hg25TN9WGLqM12b1TQygdWZhLXeHFTDu' // HNT
			];

			const popularTokensData = registry.tokens
				.filter((token: any) => popularMints.includes(token.address))
				.map((token: any) => ({
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
			const exists = existingTokens.find((t) => t.mint === token.mint);

			if (exists) {
				showToastMessage(`${token.symbol || 'Token'} is already in your wallet`, 'error');
				return;
			}

			// Add token to wallet service storage for this specific wallet
			await walletService.addImportedTokenToWallet(
				{
					mint: token.mint,
					symbol: token.symbol || 'Unknown',
					name: token.name || 'Unknown Token',
					decimals: token.decimals || 9,
					type: token.type || 'token',
					collectionSymbol: token.collectionSymbol
				},
				address
			);

			showToastMessage(
				`${token.symbol || token.name || 'Token'} has been added to your wallet!`,
				'success'
			);
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function checkCollectionStats() {
		if (!searchQuery.trim()) return;

		try {
			isSearching = true;
			const collectionStats = await walletService.fetchNFTCollectionData(searchQuery.trim());

			if (collectionStats) {
				// Display collection stats
				console.log('Collection stats:', collectionStats);
				showToastMessage(
					`Collection "${searchQuery}" found! Floor price: ${collectionStats.floorPrice / 1000000} SOL`,
					'success'
				);
			} else {
				showToastMessage('Collection not found or no data available.', 'error');
			}
		} catch {
			showToastMessage('Failed to fetch collection data.', 'error');
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
			const exists = existingTokens.find((t) => t.mint === tokenAddress);

			if (exists) {
				showToastMessage('Token is already in your wallet', 'error');
				return;
			}

			// Add as unknown token - metadata will be fetched later
			await walletService.addImportedTokenToWallet(
				{
					mint: tokenAddress,
					symbol: 'Unknown',
					name: 'Unknown Token',
					decimals: 9
				},
				address
			);

			showToastMessage(
				'Custom token added to your wallet! Token details will be fetched when displayed.',
				'success'
			);
			customTokenAddress = '';
			showAddCustom = false;

			// Dispatch custom event to notify wallet page to refresh
			window.dispatchEvent(
				new CustomEvent('tokensUpdated', { detail: { token: { mint: tokenAddress } } })
			);

			console.log('Custom token added to wallet:', address, tokenAddress);
		} catch (e) {
			console.error('Error adding custom token:', e);
			showToastMessage('Failed to add custom token. Please try again.', 'error');
		}
	}
</script>

<section
	class="relative flex h-[600px] max-h-[600px] flex-col overflow-hidden bg-[#101212] px-4 pt-4 pb-4 text-white"
>
	<div class="mb-4 flex flex-shrink-0 items-center gap-4">
		<button onclick={goBack} class="rounded-lg p-2 transition-colors hover:bg-[#202222]">
			<ArrowLeft size="20" />
		</button>
		<h1 class="text-xl font-bold">Import Tokens</h1>
	</div>

	<div
		class="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2"
	>
		<!-- Wallet Info -->
		<div class="rounded-lg bg-[#202222] p-3">
			<div class="mb-2 flex items-center gap-2">
				<span class="size-2 rounded-full bg-green-500"></span>
				<span class="text-sm">Wallet: {formatWalletAddress(address)}</span>
			</div>
			<p class="text-xs text-gray-400">
				Adding tokens will create associated token accounts when you receive them.
			</p>
		</div>

		<!-- Search -->
		<div class="relative flex items-center gap-2">
			<Search size="16" class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Enter token mint address..."
				class="w-full rounded-lg border border-gray-600 bg-[#202222] py-2 pr-4 pl-10 text-white focus:border-[#00ccba] focus:outline-none"
				onkeydown={(e) => {
					if (e.key === 'Enter') handleSearch();
				}}
			/>
			<button
				class="rounded-lg bg-[#00ccba] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00eeda]"
				onclick={handleSearch}
				disabled={isSearching}
			>
				{isSearching ? 'Searching...' : 'Search'}
			</button>
		</div>

		<!-- Add Custom Token Button -->
		<button
			onclick={() => (showAddCustom = !showAddCustom)}
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 bg-[#303333] px-4 py-2 font-medium text-white transition-colors hover:bg-[#404444]"
		>
			<Plus size="16" />
			Add Custom Token
		</button>

		{#if showAddCustom}
			<div class="space-y-4 rounded-lg bg-[#202222] p-4">
				<h3 class="font-semibold">Add Custom Token</h3>
				<input
					type="text"
					bind:value={customTokenAddress}
					placeholder="Enter token mint address"
					class="w-full rounded-lg border border-gray-600 bg-[#303333] p-3 text-white focus:border-[#00ccba] focus:outline-none"
				/>
				<div class="flex gap-2">
					<button
						onclick={() => (showAddCustom = false)}
						class="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-500"
					>
						Cancel
					</button>
					<button
						onclick={addCustomToken}
						class="flex-1 rounded-lg bg-[#00ccba] px-4 py-2 font-medium text-black transition-colors hover:bg-[#00eeda]"
					>
						Add Token
					</button>
				</div>
			</div>
		{/if}

		<!-- Real Token Search Result -->
		{#if searchedToken}
			<div class="flex flex-col gap-2 rounded-lg bg-[#202222] p-4">
				<div class="flex items-center gap-2">
					<div class="flex size-8 items-center justify-center rounded-full bg-[#303333]">
						<span class="text-base">🪙</span>
					</div>
					<div>
						<div class="flex items-center gap-2">
							<h4 class="font-semibold">{searchedToken.symbol || 'Unknown'}</h4>
						</div>
						<p class="text-sm text-gray-400">{searchedToken.name || 'Unknown Token'}</p>
						<p class="max-w-[100px] truncate text-xs text-gray-500">{searchedToken.mint}</p>
						<p class="text-xs text-gray-500">Decimals: {searchedToken.decimals}</p>
					</div>
				</div>
				<button
					onclick={() => addToken(searchedToken)}
					class="mt-2 rounded-lg bg-[#00ccba] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00eeda]"
				>
					Add
				</button>
			</div>
		{/if}

		<!-- CYAI & Ecosystem Tokens -->
		<div class="rounded-lg bg-[#202222] p-4">
			<h3 class="mb-3 font-semibold text-[#00ccba]">CYAI & Ecosystem Tokens</h3>
			<div class="space-y-2">
				{#each netsepio_tokens as token (token.name)}
					<div class="flex items-center justify-between rounded-lg bg-[#303333] p-2">
						<div class="flex items-center gap-2">
							<div class="flex size-8 items-center justify-center rounded-full bg-[#00ccba]">
								<span class="text-xs font-bold text-black">{token.symbol.charAt(0)}</span>
							</div>
							<div>
								<h4 class="text-sm font-semibold">{token.symbol}</h4>
								<p class="text-xs text-gray-400">{token.name}</p>
							</div>
						</div>
						<button
							onclick={() => addToken(token)}
							class="rounded-lg bg-[#00ccba] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#00eeda]"
						>
							Add
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Import NFT Collections -->
		<div class="rounded-lg bg-[#202222] p-4">
			<h3 class="mb-3 font-semibold text-[#00ccba]">Import NFT Collections</h3>
			<p class="mb-3 text-xs text-gray-400">
				Track your NFT collections to view them in your wallet
			</p>
			<div class="space-y-2">
				{#each netsepio_nft_collections as collection (collection.name)}
					<div class="flex items-center justify-between rounded-lg bg-[#303333] p-2">
						<div class="flex items-center gap-2">
							<div
								class="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-[#00ccba] to-[#00eeda]"
							>
								<span class="text-xs font-bold text-black">🎨</span>
							</div>
							<div>
								<h4 class="text-sm font-semibold">{collection.symbol}</h4>
								<p class="text-xs text-gray-400">{collection.name}</p>
								<p class="text-xs text-gray-500">NFT Collection</p>
							</div>
						</div>
						<button
							onclick={() => addToken(collection)}
							class="rounded-lg bg-[#00ccba] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#00eeda]"
						>
							Import
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Popular Tokens -->
		<div class="rounded-lg bg-[#202222] p-4">
			<h3 class="mb-3 font-semibold">Popular Tokens</h3>
			{#if isLoadingPopularTokens}
				<div class="py-4 text-center">
					<div class="mx-auto h-5 w-5 animate-spin rounded-full border-b-2 border-[#00ccba]"></div>
					<p class="mt-2 text-xs text-gray-400">Loading popular tokens...</p>
				</div>
			{:else}
				<div class="space-y-2">
					{#each popularTokens as token (token.name)}
						<div class="flex items-center justify-between rounded-lg bg-[#303333] p-2">
							<div class="flex items-center gap-2">
								<div class="flex size-8 items-center justify-center rounded-full bg-[#404040]">
									<span class="text-xs font-bold text-[#00ccba]">{token.symbol.charAt(0)}</span>
								</div>
								<div>
									<h4 class="text-sm font-semibold">{token.symbol}</h4>
									<p class="text-xs text-gray-400">{token.name}</p>
								</div>
							</div>
							<button
								onclick={() => addToken(token)}
								class="rounded-lg bg-[#00ccba] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#00eeda]"
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
