<script lang='ts'>
	import { ArrowLeft, Plus, Search, AlertTriangle } from "@lucide/svelte";
	import { walletAddress } from '../../store/store';
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import Toast from "$lib/components/ui/toast.svelte";

	let address = $state('');
	let searchQuery = $state('');
	let customTokenAddress = $state('');
	let showAddCustom = $state(false);
	let error = $state('');
	let success = $state('');

	walletAddress.subscribe((value) => address = value);

	// Popular tokens on Solana (for demo purposes)
	const popularTokens = [
		{ 
			symbol: 'USDC', 
			name: 'USD Coin', 
			mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
			icon: '$',
			website: 'https://www.centre.co/',
			verified: true
		},
		{ 
			symbol: 'USDT', 
			name: 'Tether USD', 
			mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
			icon: '₮',
			website: 'https://tether.to/',
			verified: true
		},
		{ 
			symbol: 'RAY', 
			name: 'Raydium', 
			mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
			icon: '🔥',
			website: 'https://raydium.io/',
			verified: true
		},
		{ 
			symbol: 'SRM', 
			name: 'Serum', 
			mint: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
			icon: '🧬',
			website: 'https://projectserum.com/',
			verified: true
		},
		{ 
			symbol: 'ORCA', 
			name: 'Orca', 
			mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
			icon: '🐋',
			website: 'https://www.orca.so/',
			verified: true
		},
		{ 
			symbol: 'MANGO', 
			name: 'Mango', 
			mint: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
			icon: '🥭',
			website: 'https://mango.markets/',
			verified: true
		}
	];

	let filteredTokens = $derived(
		popularTokens.filter(token => 
			token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function goBack() {
		window.history.back();
	}

	function addToken(tokenMint: string, symbol: string) {
		// In a real implementation, this would:
		// 1. Check if the token account exists
		// 2. Create associated token account if needed
		// 3. Add to wallet's token list
		
		success = `${symbol} has been added to your watchlist. Token accounts will be created when you receive tokens.`;
		
		setTimeout(() => {
			window.history.back();
		}, 2000);
	}

	function addCustomToken() {
		if (!customTokenAddress.trim()) {
			error = 'Please enter a token mint address';
			return;
		}

		// Basic validation for Solana address format
		if (customTokenAddress.length < 32 || customTokenAddress.length > 44) {
			error = 'Invalid token mint address format';
			return;
		}

		error = '';
		success = 'Custom token added to watchlist. Token details will be fetched when you receive tokens.';
		customTokenAddress = '';
		showAddCustom = false;

		setTimeout(() => {
			window.history.back();
		}, 2000);
	}
</script>

<section class="h-full pt-4 pb-8 px-8 bg-[#101212] text-white relative">
	<div class="flex items-center gap-4 mb-6">
		<button onclick={goBack} class="p-2 hover:bg-[#202222] rounded-lg transition-colors">
			<ArrowLeft size="20" />
		</button>
		<h1 class="text-xl font-bold">Import Tokens</h1>
	</div>

	<div class="space-y-6">
		<!-- Wallet Info -->
		<div class="bg-[#202222] rounded-lg p-4">
			<div class="flex items-center gap-2 mb-2">
				<span class="size-2 rounded-full bg-green-500"></span>
				<span class="text-sm">Wallet: {formatWalletAddress(address)}</span>
			</div>
			<p class="text-xs text-gray-400">
				Adding tokens will create associated token accounts when you receive them.
			</p>
		</div>

		<!-- Search -->
		<div class="relative">
			<Search size="16" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search tokens..."
				class="w-full pl-10 pr-4 py-3 bg-[#202222] border border-gray-600 rounded-lg focus:border-[#00ccba] focus:outline-none text-white"
			/>
		</div>

		<!-- Add Custom Token Button -->
		<button
			onclick={() => showAddCustom = !showAddCustom}
			class="w-full bg-[#303333] hover:bg-[#404444] border border-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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

		{#if error}
			<div class="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
				<AlertTriangle size="16" class="text-red-400" />
				<span class="text-red-400 text-sm">{error}</span>
			</div>
		{/if}

		<!-- Popular Tokens -->
		<div>
			<h2 class="font-semibold mb-4">Popular Tokens</h2>
			<div class="space-y-2 max-h-[300px] overflow-y-auto">
				{#each filteredTokens as token}
					<div class="bg-[#202222] rounded-lg p-4 flex items-center justify-between hover:bg-[#252525] transition-colors">
						<div class="flex items-center gap-3">
							<div class="size-10 bg-[#303333] rounded-full flex items-center justify-center">
								<span class="text-lg">{token.icon}</span>
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-semibold">{token.symbol}</h3>
									{#if token.verified}
										<span class="text-[#00ccba] text-xs">✓</span>
									{/if}
								</div>
								<p class="text-sm text-gray-400">{token.name}</p>
								<p class="text-xs text-gray-500 truncate max-w-[200px]">{token.mint}</p>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<button
								onclick={() => addToken(token.mint, token.symbol)}
								class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-2 px-4 rounded-lg transition-colors text-sm"
							>
								Add
							</button>
							{#if token.website}
								<button
									onclick={() => window.open(token.website, '_blank')}
									class="text-[#00ccba] hover:text-[#00eeda] text-xs flex items-center gap-1 justify-center"
								>
									Website
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
									</svg>
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		{#if filteredTokens.length === 0 && searchQuery}
			<div class="text-center py-8">
				<p class="text-gray-400">No tokens found matching "{searchQuery}"</p>
				<p class="text-sm text-gray-500 mt-2">Try adding a custom token by mint address</p>
			</div>
		{/if}
	</div>
</section>

{#if success}
	<Toast
		status={success}
		success={true}
		error={false}
		open={true}
	/>
{/if}