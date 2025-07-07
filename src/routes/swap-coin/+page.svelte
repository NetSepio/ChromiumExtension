<script lang='ts'>
	import { ArrowLeft, RefreshCw, ArrowUpDown, AlertTriangle, ExternalLink, ChevronDown } from "@lucide/svelte";
	import { walletAddress } from '../../store/store';
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import Toast from "$lib/components/ui/toast.svelte";

	let address = $state('');
	let fromToken = $state('SOL');
	let toToken = $state('USDC');
	let fromAmount = $state('');
	let toAmount = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let slippage = $state('0.5');
	let showSlippageSettings = $state(false);
	let rpcUrl = $state<'mainnet' | 'testnet'>('mainnet');

	// Load saved network preference on component mount
	$effect(() => {
		const savedNetwork = localStorage.getItem('selected-network') as 'mainnet' | 'testnet';
		if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
			rpcUrl = savedNetwork;
		}
	});

	// Mock token list - in a real app, this would come from Jupiter or another DEX API
	const tokens = [
		{ symbol: 'SOL', name: 'Solana', icon: '◎', balance: 1.234567 },
		{ symbol: 'USDC', name: 'USD Coin', icon: '$', balance: 0 },
		{ symbol: 'USDT', name: 'Tether USD', icon: '₮', balance: 0 },
		{ symbol: 'RAY', name: 'Raydium', icon: '🔥', balance: 0 },
		{ symbol: 'SRM', name: 'Serum', icon: '🧬', balance: 0 },
		{ symbol: 'ORCA', name: 'Orca', icon: '🐋', balance: 0 }
	];

	walletAddress.subscribe((value) => address = value);

	let showFromTokens = $state(false);
	let showToTokens = $state(false);
	let mockQuote = $state<{ rate: number; priceImpact: number; minimumReceived: number } | null>(null);

	function getTokenInfo(symbol: string) {
		return tokens.find(t => t.symbol === symbol) || tokens[0];
	}

	function selectFromToken(symbol: string) {
		fromToken = symbol;
		showFromTokens = false;
		if (fromToken === toToken) {
			// Swap the tokens if they're the same
			toToken = fromToken === 'SOL' ? 'USDC' : 'SOL';
		}
		getQuote();
	}

	function selectToToken(symbol: string) {
		toToken = symbol;
		showToTokens = false;
		if (fromToken === toToken) {
			// Swap the tokens if they're the same
			fromToken = toToken === 'SOL' ? 'USDC' : 'SOL';
		}
		getQuote();
	}

	function swapTokens() {
		const temp = fromToken;
		fromToken = toToken;
		toToken = temp;
		
		const tempAmount = fromAmount;
		fromAmount = toAmount;
		toAmount = tempAmount;
		
		getQuote();
	}

	async function getQuote() {
		if (!fromAmount || parseFloat(fromAmount) <= 0) {
			toAmount = '';
			mockQuote = null;
			return;
		}

		isLoading = true;
		error = '';

		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Mock exchange rates (in a real app, use Jupiter API)
			const mockRates: { [key: string]: number } = {
				'SOL-USDC': 85.50,
				'SOL-USDT': 85.25,
				'SOL-RAY': 150.0,
				'SOL-SRM': 250.0,
				'SOL-ORCA': 45.0,
				'USDC-SOL': 1/85.50,
				'USDT-SOL': 1/85.25,
				'RAY-SOL': 1/150.0,
				'SRM-SOL': 1/250.0,
				'ORCA-SOL': 1/45.0,
				'USDC-USDT': 0.999,
				'USDT-USDC': 1.001
			};

			const rateKey = `${fromToken}-${toToken}`;
			const rate = mockRates[rateKey] || 1;
			
			const amount = parseFloat(fromAmount);
			const received = amount * rate;
			const priceImpact = Math.random() * 2; // Random 0-2% price impact
			const slippageAmount = received * (parseFloat(slippage) / 100);
			
			toAmount = received.toFixed(6);
			mockQuote = {
				rate,
				priceImpact,
				minimumReceived: received - slippageAmount
			};
		} catch (err) {
			error = 'Failed to get quote';
			console.error('Quote error:', err);
		} finally {
			isLoading = false;
		}
	}

	// Debounced quote fetching
	let quoteTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		if (fromAmount) {
			clearTimeout(quoteTimeout);
			quoteTimeout = setTimeout(getQuote, 500);
		}
	});

	async function executeSwap() {
		if (!mockQuote || !fromAmount) return;

		error = '';
		isLoading = true;

		try {
			// In a real app, this would interact with Jupiter or another DEX
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Simulate random success/failure
			if (Math.random() > 0.1) {
				// 90% success rate
				fromAmount = '';
				toAmount = '';
				mockQuote = null;
				// Show success toast
			} else {
				throw new Error('Swap failed due to slippage');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Swap failed';
		} finally {
			isLoading = false;
		}
	}

	function goBack() {
		window.history.back();
	}

	function setSlippage(value: string) {
		slippage = value;
		showSlippageSettings = false;
		if (mockQuote) {
			getQuote();
		}
	}

	// Close dropdowns when clicking outside
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.token-dropdown')) {
				showFromTokens = false;
				showToTokens = false;
			}
		}
		
		if (showFromTokens || showToTokens) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<section class="h-[600px] max-h-[600px] overflow-hidden pt-3 pb-6 px-6 bg-[#101212] text-white relative">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-3">
			<button onclick={goBack} class="p-1.5 hover:bg-[#202222] rounded-lg transition-colors">
				<ArrowLeft size="18" />
			</button>
			<div>
				<h1 class="text-lg font-bold">Swap Tokens</h1>
				<div class="text-xs text-gray-400 capitalize">({rpcUrl})</div>
			</div>
		</div>
		<button 
			onclick={() => showSlippageSettings = !showSlippageSettings}
			class="p-2 hover:bg-[#202222] rounded-lg transition-colors text-gray-400"
			title="Slippage Settings"
		>
			<RefreshCw size="14" />
		</button>
	</div>

	<div class="h-[calc(100%-4rem)] overflow-y-auto space-y-4">
		<!-- Slippage Settings -->
		{#if showSlippageSettings}
			<div class="bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-xl p-3 border border-[#404040]">
				<h3 class="text-sm font-medium mb-2">Slippage Tolerance</h3>
				<div class="flex gap-2">
					{#each ['0.1', '0.5', '1.0'] as value}
						<button
							onclick={() => setSlippage(value)}
							class="px-2 py-1.5 rounded-lg text-xs transition-colors {slippage === value ? 'bg-[#00ccba] text-black' : 'bg-[#2a2a2a] hover:bg-[#353535] border border-[#404040]'}"
						>
							{value}%
						</button>
					{/each}
					<input
						type="number"
						step="0.1"
						min="0"
						max="50"
						bind:value={slippage}
						class="px-2 py-1.5 bg-[#2a2a2a] border border-[#404040] rounded-lg text-xs w-16 focus:border-[#00ccba] focus:outline-none"
					/>
				</div>
			</div>
		{/if}

		<!-- From Token Card -->
		<div class="bg-gradient-to-r from-[#202222] to-[#252525] rounded-xl p-4 border border-[#303030]">
			<div class="flex justify-between items-center mb-3">
				<span class="text-gray-400 text-sm">From</span>
				<span class="text-gray-400 text-xs">
					Balance: {getTokenInfo(fromToken).balance.toFixed(6)}
				</span>
			</div>
			
			<div class="flex items-center gap-3">
				<div class="flex-1">
					<input
						type="number"
						step="0.000001"
						min="0"
						bind:value={fromAmount}
						placeholder="0.000000"
						class="w-full bg-transparent text-lg font-bold text-white placeholder-gray-400 focus:outline-none font-mono"
					/>
				</div>
				
				<div class="relative token-dropdown">
					<button
						onclick={() => {showFromTokens = !showFromTokens; showToTokens = false;}}
						class="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-3 py-2 rounded-xl transition-colors border border-[#404040]"
					>
						<span class="text-base">{getTokenInfo(fromToken).icon}</span>
						<span class="font-medium text-sm">{fromToken}</span>
						<ChevronDown size="14" class="text-gray-400" />
					</button>
					
					{#if showFromTokens}
						<div class="absolute top-12 right-0 bg-[#1a1a1a] border border-[#404040] rounded-xl shadow-lg z-50 min-w-48">
							{#each tokens.slice(0, 4) as token}
								<button
									onclick={() => selectFromToken(token.symbol)}
									class="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#2a2a2a] transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
								>
									<span class="text-base">{token.icon}</span>
									<div class="flex-1">
										<div class="font-medium text-sm">{token.symbol}</div>
										<div class="text-xs text-gray-400">{token.name}</div>
									</div>
									<div class="text-xs text-gray-400 font-mono">
										{token.balance.toFixed(4)}
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Swap Button -->
		<div class="flex justify-center">
			<button
				onclick={swapTokens}
				class="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl transition-colors border border-[#404040] group"
			>
				<ArrowUpDown size="16" class="text-[#00ccba] group-hover:scale-110 transition-transform" />
			</button>
		</div>

		<!-- To Token Card -->
		<div class="bg-gradient-to-r from-[#202222] to-[#252525] rounded-xl p-4 border border-[#303030]">
			<div class="flex justify-between items-center mb-3">
				<span class="text-gray-400 text-sm">To (estimated)</span>
				<span class="text-gray-400 text-xs">
					Balance: {getTokenInfo(toToken).balance.toFixed(6)}
				</span>
			</div>
			
			<div class="flex items-center gap-3">
				<div class="flex-1">
					{#if isLoading && fromAmount}
						<div class="flex items-center gap-2 text-lg font-bold font-mono">
							<div class="animate-spin rounded-full h-3 w-3 border-b-2 border-[#00ccba]"></div>
							<span class="text-gray-400 text-sm">Getting quote...</span>
						</div>
					{:else}
						<input
							type="text"
							readonly
							value={toAmount}
							placeholder="0.000000"
							class="w-full bg-transparent text-lg font-bold text-white placeholder-gray-400 focus:outline-none font-mono"
						/>
					{/if}
				</div>
				
				<div class="relative token-dropdown">
					<button
						onclick={() => {showToTokens = !showToTokens; showFromTokens = false;}}
						class="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-3 py-2 rounded-xl transition-colors border border-[#404040]"
					>
						<span class="text-base">{getTokenInfo(toToken).icon}</span>
						<span class="font-medium text-sm">{toToken}</span>
						<ChevronDown size="14" class="text-gray-400" />
					</button>
					
					{#if showToTokens}
						<div class="absolute top-12 right-0 bg-[#1a1a1a] border border-[#404040] rounded-xl shadow-lg z-50 min-w-48">
							{#each tokens.slice(0, 4) as token}
								<button
									onclick={() => selectToToken(token.symbol)}
									class="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#2a2a2a] transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
								>
									<span class="text-base">{token.icon}</span>
									<div class="flex-1">
										<div class="font-medium text-sm">{token.symbol}</div>
										<div class="text-xs text-gray-400">{token.name}</div>
									</div>
									<div class="text-xs text-gray-400 font-mono">
										{token.balance.toFixed(4)}
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Quote Info -->
		{#if mockQuote && fromAmount && toAmount}
			<div class="bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-xl p-3 border border-[#404040] space-y-2">
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Rate</span>
					<span class="font-mono">1 {fromToken} = {mockQuote.rate.toFixed(6)} {toToken}</span>
				</div>
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Price Impact</span>
					<span class="font-mono {mockQuote.priceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}">
						{mockQuote.priceImpact.toFixed(2)}%
					</span>
				</div>
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Minimum Received</span>
					<span class="font-mono">{mockQuote.minimumReceived.toFixed(6)} {toToken}</span>
				</div>
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Slippage</span>
					<span class="font-mono">{slippage}%</span>
				</div>
			</div>
		{/if}

		<!-- Error Display -->
		{#if error}
			<div class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
				<AlertTriangle size="14" class="text-red-400 mt-0.5 flex-shrink-0" />
				<span class="text-red-400 text-xs">{error}</span>
			</div>
		{/if}

		<!-- Demo Notice -->
		<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
			<div class="flex items-center gap-2 mb-1">
				<AlertTriangle size="14" class="text-yellow-400" />
				<span class="text-yellow-400 font-medium text-xs">Demo Mode</span>
			</div>
			<p class="text-xs text-gray-300">
				Swap functionality is in demo mode. For real swaps, use 
				<a href="https://jup.ag" target="_blank" class="text-[#00ccba] hover:text-[#00eeda] inline-flex items-center gap-1">
					Jupiter <ExternalLink size="10" />
				</a>
			</p>
		</div>

		<!-- Swap Button -->
		<button
			onclick={executeSwap}
			disabled={!mockQuote || !fromAmount || !toAmount || isLoading}
			class="w-full bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00eeda] hover:to-[#00ccba] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
		>
			{#if isLoading}
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
				Swapping...
			{:else}
				<RefreshCw size="16" />
				{mockQuote ? `Swap ${fromToken} for ${toToken}` : 'Enter amount to swap'}
			{/if}
		</button>
	</div>
</section>