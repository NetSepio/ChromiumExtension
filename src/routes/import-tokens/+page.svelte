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

	// Token list state
	let allTokens = $state<any[]>([]);
	let filteredTokens = $state<any[]>([]);
	let isLoadingTokens = $state(false);
	let showingMore = $state(false);
	let imageErrors = $state(new Set<string>());
	const DEFAULT_DISPLAY_COUNT = 8;
	const EXPANDED_DISPLAY_COUNT = 20;

	// Fetch comprehensive token list from Jupiter
	async function fetchTokenList() {
		try {
			isLoadingTokens = true;
			
			// Try Jupiter API first (most comprehensive)
			try {
				const jupiterResponse = await fetch('https://token.jup.ag/all');
				const jupiterTokens = await jupiterResponse.json();
				
				// Filter and format Jupiter tokens (verified tokens only)
				const formattedTokens = jupiterTokens
					.filter((token: any) => 
						token.symbol && 
						token.name && 
						token.address && 
						token.decimals !== undefined &&
						!token.tags?.includes('unknown') // Filter out unknown/unverified tokens
					)
					.map((token: any) => ({
						mint: token.address,
						symbol: token.symbol,
						name: token.name,
						decimals: token.decimals,
						logoURI: token.logoURI
					}))
					.slice(0, 2000); // Limit to first 2000 for performance
				
				allTokens = formattedTokens;
				filteredTokens = formattedTokens.slice(0, DEFAULT_DISPLAY_COUNT);
				console.log(`Fetched ${formattedTokens.length} tokens from Jupiter`);
				return;
			} catch (jupiterError) {
				console.warn('Jupiter API failed, falling back to Solana registry:', jupiterError);
			}
			
			// Fallback to Solana Token Registry
			const registryUrl = `https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json`;
			const registryResponse = await fetch(registryUrl);
			const registry = await registryResponse.json();

			const formattedTokens = registry.tokens.map((token: any) => ({
				mint: token.address,
				symbol: token.symbol,
				name: token.name,
				decimals: token.decimals,
				logoURI: token.logoURI
			}));

			allTokens = formattedTokens;
			filteredTokens = formattedTokens.slice(0, DEFAULT_DISPLAY_COUNT);
			console.log(`Fetched ${formattedTokens.length} tokens from Solana registry`);
			
		} catch (error) {
			console.error('Error fetching token list:', error);
			// Ultra fallback to hardcoded popular tokens
			const fallbackTokens = [
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
				},
				{
					mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
					symbol: 'JUP',
					name: 'Jupiter',
					decimals: 6
				}
			];
			allTokens = fallbackTokens;
			filteredTokens = fallbackTokens;
		} finally {
			isLoadingTokens = false;
		}
	}

	// Load token list on component mount
	$effect(() => {
		fetchTokenList();
	});

	// Filter tokens based on search query
	function filterTokens() {
		if (!searchQuery.trim()) {
			const displayCount = showingMore ? EXPANDED_DISPLAY_COUNT : DEFAULT_DISPLAY_COUNT;
			filteredTokens = allTokens.slice(0, displayCount);
			return;
		}
		
		const query = searchQuery.toLowerCase().trim();
		const filtered = allTokens.filter(token => 
			token.symbol.toLowerCase().includes(query) || 
			token.name.toLowerCase().includes(query)
		);
		
		// Show more results when searching (up to 20)
		filteredTokens = filtered.slice(0, 20);
	}

	// Show more tokens function
	function showMoreTokens() {
		showingMore = true;
		filterTokens();
	}

	// Watch for search query changes
	$effect(() => {
		// Reset showingMore when searching
		if (searchQuery.trim()) {
			showingMore = false;
		}
		filterTokens();
	});

	function goBack() {
		window.history.back();
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
			searchQuery = '';

			// Dispatch custom event to notify wallet page to refresh
			window.dispatchEvent(new CustomEvent('tokensUpdated', { detail: { token } }));

			console.log('Token added successfully to wallet:', address, token);
		} catch (e) {
			console.error('Error adding token:', e);
			showToastMessage('Failed to add token. Please try again.', 'error');
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

		<!-- Search Filter -->
		<div class="relative">
			<Search size="16" class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search tokens by name or symbol..."
				class="w-full rounded-lg border border-gray-600 bg-[#202222] py-2 pr-4 pl-10 text-white focus:border-[#00ccba] focus:outline-none"
			/>
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

		<!-- Token List -->
		<div class="rounded-lg bg-[#202222] p-4">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold">
					{searchQuery.trim() ? `Search Results (${filteredTokens.length})` : 'Popular Tokens'}
				</h3>
				{#if !searchQuery.trim() && allTokens.length > DEFAULT_DISPLAY_COUNT}
					<span class="text-xs text-gray-400">
						Showing {filteredTokens.length} of {allTokens.length} tokens
					</span>
				{/if}
			</div>
			
			{#if isLoadingTokens}
				<div class="py-8 text-center">
					<div class="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-[#00ccba]"></div>
					<p class="mt-3 text-sm text-gray-400">Loading tokens...</p>
				</div>
			{:else if filteredTokens.length === 0}
				<div class="py-8 text-center">
					<p class="text-sm text-gray-400">
						{searchQuery.trim() ? 'No tokens found matching your search.' : 'No tokens available.'}
					</p>
					{#if searchQuery.trim()}
						<p class="mt-2 text-xs text-gray-500">Try a different search term or add a custom token.</p>
					{/if}
				</div>
			{:else}
				<div class="space-y-2">
					{#each filteredTokens as token (token.mint)}
						<div class="flex items-center justify-between rounded-lg bg-[#303333] p-3 transition-colors hover:bg-[#404040]">
							<div class="flex items-center gap-3">
								<div class="flex size-10 items-center justify-center rounded-full bg-[#404040] overflow-hidden">
									{#if token.logoURI && !imageErrors.has(token.mint)}
										<img 
											src={token.logoURI} 
											alt={token.symbol}
											class="size-full rounded-full object-cover"
											onerror={() => {
												imageErrors.add(token.mint);
												imageErrors = new Set(imageErrors);
											}}
										/>
									{:else}
										<span class="text-sm font-bold text-[#00ccba]">{token.symbol.charAt(0)}</span>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<h4 class="font-semibold text-white">{token.symbol}</h4>
									</div>
									<p class="truncate text-sm text-gray-400">{token.name}</p>
									<p class="text-xs text-gray-500">Decimals: {token.decimals}</p>
								</div>
							</div>
							<button
								onclick={() => addToken(token)}
								class="rounded-lg bg-[#00ccba] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00eeda] flex-shrink-0"
							>
								Add
							</button>
						</div>
					{/each}
				</div>
				
				<!-- Show More Button -->
				{#if !searchQuery.trim() && !showingMore && allTokens.length > DEFAULT_DISPLAY_COUNT}
					<div class="mt-4 text-center">
						<button
							onclick={showMoreTokens}
							class="rounded-lg border border-gray-600 bg-[#303333] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#404040]"
						>
							Show More Tokens ({allTokens.length - DEFAULT_DISPLAY_COUNT} more)
						</button>
					</div>
				{/if}
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
