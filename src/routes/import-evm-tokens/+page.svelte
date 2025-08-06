<script lang="ts">
	import { BadgePlus, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/ui/toast.svelte';
	import { EVMWalletService } from '$lib/helpers/evmTransactions';
	import type { EVMTokenInfo } from '$lib/helpers/evmTransactions';
	import { getChainAddress } from '../../store/store';
	import { onMount } from 'svelte';

	let tokenAddress = $state('');
	let isLoading = $state(false);
	let tokenInfo = $state<EVMTokenInfo | null>(null);
	let errorMessage = $state('');
	let isAddingToken = $state(false);
	let showToast = $state(false);
	let toastMessage = $state('');
	let toastSuccess = $state(false);
	let importedTokens = $state<string[]>([]);
	let walletAddress = $state('');
	let selectedNetwork = $state('peaq-mainnet');
	let walletService = $derived(new EVMWalletService(selectedNetwork as keyof typeof import('$lib/getBalance').NETWORK_CONFIGS));

	// Load wallet address and network on mount
	onMount(async () => {
		try {
			const evmAddress = await getChainAddress('evm');
			walletAddress = evmAddress || '';
			
			// Load selected EVM network from localStorage
			const savedNetwork = localStorage.getItem('selected-evm-network');
			if (savedNetwork) {
				selectedNetwork = savedNetwork;
			}
			
			if (walletAddress) {
				await loadImportedTokens();
			}
		} catch (error) {
			console.error('Error loading wallet address:', error);
			errorMessage = 'Failed to load wallet address';
		}
	});

	async function loadImportedTokens() {
		try {
			importedTokens = await walletService.getImportedTokensForWallet(walletAddress);
		} catch (error) {
			console.error('Error loading imported tokens:', error);
		}
	}

	async function validateToken() {
		if (!tokenAddress.trim()) {
			errorMessage = 'Please enter a token address';
			return;
		}

		// Basic address format validation
		if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress.trim())) {
			errorMessage = 'Invalid token address format. Address should be 40 characters long and start with 0x';
			return;
		}

		isLoading = true;
		errorMessage = '';
		tokenInfo = null;

		try {
			const info = await walletService.getTokenInfo(tokenAddress.trim(), walletAddress);
			if (info) {
				tokenInfo = info;
			} else {
				errorMessage = 'Unable to fetch token information. Please verify the contract address is a valid ERC-20 token.';
			}
		} catch (error: any) {
			console.error('Token validation error:', error);
			errorMessage = EVMWalletService.getUserFriendlyErrorMessage(error);
		} finally {
			isLoading = false;
		}
	}

	async function addToken() {
		if (!tokenInfo || !walletAddress) return;

		// Check if token is already imported
		if (importedTokens.includes(tokenAddress.toLowerCase())) {
			showToastMessage('Token already imported', false);
			return;
		}

		isAddingToken = true;

		try {
			await walletService.addImportedToken(walletAddress, tokenAddress.trim());
			
			// Reload imported tokens
			await loadImportedTokens();
			
			// Reset form
			tokenAddress = '';
			tokenInfo = null;
			
			showToastMessage('Token imported successfully!', true);
			
			// Dispatch event to notify wallet page
			window.dispatchEvent(new CustomEvent('tokensUpdated', { 
				detail: { type: 'evm', network: selectedNetwork } 
			}));
			
		} catch (error: any) {
			console.error('Error adding token:', error);
			showToastMessage(EVMWalletService.getUserFriendlyErrorMessage(error), false);
		} finally {
			isAddingToken = false;
		}
	}

	async function removeToken(tokenAddr: string) {
		try {
			await walletService.removeImportedToken(walletAddress, tokenAddr);
			await loadImportedTokens();
			showToastMessage('Token removed successfully', true);
			
			// Dispatch event to notify wallet page
			window.dispatchEvent(new CustomEvent('tokensUpdated', { 
				detail: { type: 'evm', network: selectedNetwork } 
			}));
		} catch (error: any) {
			console.error('Error removing token:', error);
			showToastMessage('Failed to remove token', false);
		}
	}

	function showToastMessage(message: string, success: boolean) {
		toastMessage = message;
		toastSuccess = success;
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 3000);
	}

	function resetForm() {
		tokenAddress = '';
		tokenInfo = null;
		errorMessage = '';
	}

	// Sample token addresses for different networks
	const sampleTokens = {
		'peaq-mainnet': [
			{ name: 'Wrapped PEAQ', address: '0x...', symbol: 'WPEAQ' }
		],
		'peaq-testnet': [
			{ name: 'Test Token', address: '0x...', symbol: 'TEST' }
		],
		'rise-testnet': [
			{ name: 'Test RISE Token', address: '0x...', symbol: 'TRISE' }
		]
	};
</script>

<svelte:head>
	<title>Import EVM Tokens</title>
</svelte:head>

<section class="flex h-[600px] max-h-[600px] flex-col overflow-hidden bg-[#101212] px-4 pt-4 pb-4 text-white">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-center">
		<h1 class="text-lg font-bold text-center">Import EVM Tokens</h1>
	</div>

	<!-- Network Info -->
	<div class="mb-4 rounded-lg border border-[#333333] bg-[#1a1a1a] p-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full bg-[#627eea]"></div>
				<span class="text-sm font-medium">
					{walletService.getNetworkInfo().name}
				</span>
			</div>
			<span class="text-xs text-gray-400">
				{walletService.getNetworkInfo().isTestnet ? 'Testnet' : 'Mainnet'}
			</span>
		</div>
		<div class="mt-2 text-xs text-gray-400">
			Wallet: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Loading...'}
		</div>
	</div>

	<!-- Token Import Form -->
	<div class="mb-4 rounded-lg border border-[#333333] bg-[#1a1a1a] p-4">
		<div class="mb-3 flex items-center gap-2">
			<BadgePlus color="#00ccba" size="20" />
			<h2 class="text-sm font-semibold">Add Custom Token</h2>
		</div>

		<div class="space-y-3">
			<div>
				<label for="tokenAddress" class="block text-xs text-gray-300 mb-1.5">Token Contract Address</label>
				<input
					id="tokenAddress"
					bind:value={tokenAddress}
					type="text"
					placeholder="0x..."
					class="w-full rounded-lg border border-[#404040] bg-[#202222] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00ccba] focus:outline-none"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							validateToken();
						}
					}}
				/>
			</div>

			<div class="flex gap-2">
				<button
					onclick={validateToken}
					disabled={isLoading || !tokenAddress.trim()}
					class="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#00ccba] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00eeda] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<Loader2 size="16" class="animate-spin" />
						Validating...
					{:else}
						Validate Token
					{/if}
				</button>
				<button
					onclick={resetForm}
					class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
				>
					Clear
				</button>
			</div>

			{#if errorMessage}
				<div class="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
					<AlertCircle color="#ef4444" size="16" class="mt-0.5 flex-shrink-0" />
					<p class="text-xs text-red-400">{errorMessage}</p>
				</div>
			{/if}

			{#if tokenInfo}
				<div class="rounded-lg border border-[#00ccba]/20 bg-[#00ccba]/5 p-3">
					<div class="mb-3 flex items-start gap-2">
						<CheckCircle color="#00ccba" size="16" class="mt-0.5" />
						<div class="flex-1">
							<h3 class="text-sm font-semibold text-[#00ccba]">Token Found</h3>
							<p class="text-xs text-gray-300">Ready to import</p>
						</div>
					</div>
					
					<div class="space-y-2 text-xs">
						<div class="flex justify-between">
							<span class="text-gray-400">Name:</span>
							<span>{tokenInfo.name}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Symbol:</span>
							<span>{tokenInfo.symbol}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Decimals:</span>
							<span>{tokenInfo.decimals}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Balance:</span>
							<span>{parseFloat(tokenInfo.balance).toFixed(6)} {tokenInfo.symbol}</span>
						</div>
					</div>

					<button
						onclick={addToken}
						disabled={isAddingToken}
						class="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-[#00ccba] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00eeda] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
					>
						{#if isAddingToken}
							<Loader2 size="16" class="animate-spin" />
							Adding Token...
						{:else}
							Add Token
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Imported Tokens List -->
	<div class="flex-1 overflow-hidden rounded-lg border border-[#333333] bg-[#1a1a1a]">
		<div class="border-b border-[#333333] bg-[#070707] px-4 py-3">
			<h3 class="text-sm font-semibold">Imported Tokens ({importedTokens.length})</h3>
		</div>
		
		<div class="h-full overflow-y-auto p-4">
			{#if importedTokens.length === 0}
				<div class="py-8 text-center">
					<div class="mb-2 text-2xl">🪙</div>
					<h4 class="mb-1 text-sm font-medium">No tokens imported yet</h4>
					<p class="text-xs text-gray-400">Add your first ERC-20 token using the form above</p>
				</div>
			{:else}
				<div class="space-y-2">
					{#each importedTokens as tokenAddr}
						<div class="flex items-center justify-between rounded-lg border border-[#333333] bg-[#202222] p-3">
							<div class="flex-1">
								<p class="text-sm font-medium font-mono">{tokenAddr}</p>
								<p class="text-xs text-gray-400">ERC-20 Token</p>
							</div>
							<button
								onclick={() => removeToken(tokenAddr)}
								class="text-xs text-red-400 hover:text-red-300 transition-colors"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Sample Tokens (if available) -->
	{#if sampleTokens[selectedNetwork as keyof typeof sampleTokens]?.length}
		<div class="mt-4 rounded-lg border border-[#333333] bg-[#1a1a1a] p-3">
			<h4 class="mb-2 text-xs font-medium text-gray-300">Sample Tokens for {walletService.getNetworkInfo().name}</h4>
			<div class="space-y-1">
				{#each sampleTokens[selectedNetwork as keyof typeof sampleTokens] as sample}
					<button
						onclick={() => { tokenAddress = sample.address; }}
						class="w-full text-left rounded border border-[#404040] bg-[#202222] p-2 text-xs hover:bg-[#2a2a2a] transition-colors"
					>
						<div class="font-medium">{sample.name} ({sample.symbol})</div>
						<div class="text-gray-400 font-mono">{sample.address}</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</section>

<Toast 
	status={toastMessage} 
	success={toastSuccess} 
	error={!toastSuccess} 
	open={showToast} 
/>

<style>
	::-webkit-scrollbar {
		width: 4px;
	}
	::-webkit-scrollbar-track {
		background: #1a1a1a;
	}
	::-webkit-scrollbar-thumb {
		background: #404040;
		border-radius: 2px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #555555;
	}
</style>
