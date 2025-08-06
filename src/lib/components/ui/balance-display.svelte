<script lang="ts">
	import { getBalance, NETWORK_CONFIGS, type NetworkConfig } from '$lib/getBalance';
	import { Connection, PublicKey } from '@solana/web3.js';
	import { PUBLIC_HELIUS_API_KEY } from '$env/static/public';


	interface Props {
		address: string;
		chain: 'solana' | 'evm';
		selectedNetwork?: string;
	}
	
	let { address, chain, selectedNetwork = 'peaq-mainnet' }: Props = $props();

	// State
	let balance = $state('0.0');
	let symbol = $state('');
	let loading = $state(false);
	let error = $state('');

	// Solana balance fetching
	async function getSolanaBalance(solanaAddress: string): Promise<{ balance: string; symbol: string }> {
		try {
			const connection = new Connection(`https://rpc.helius.xyz/?api-key=${PUBLIC_HELIUS_API_KEY}`);
			const publicKey = new PublicKey(solanaAddress);
			const balanceResponse = await connection.getBalance(publicKey);
			const solBalance = (balanceResponse / 1000000000).toFixed(4);
			
			return {
				balance: solBalance,
				symbol: 'SOL'
			};
		} catch (err) {
			console.error('Error fetching Solana balance:', err);
			return {
				balance: '0.0',
				symbol: 'SOL'
			};
		}
	}

	// EVM balance fetching
	async function getEvmBalance(evmAddress: string, network: string): Promise<{ balance: string; symbol: string }> {
		try {
			const result = await getBalance(evmAddress, network);
			return {
				balance: parseFloat(result.balance).toFixed(4),
				symbol: result.symbol
			};
		} catch (err) {
			console.error(`Error fetching EVM balance for ${network}:`, err);
			const config = NETWORK_CONFIGS[network];
			return {
				balance: '0.0',
				symbol: config?.symbol || 'ETH'
			};
		}
	}

	// Main balance fetching function
	async function fetchBalance() {
		if (!address) return;
		
		loading = true;
		error = '';
		
		try {
			let result: { balance: string; symbol: string };
			
			if (chain === 'solana') {
				result = await getSolanaBalance(address);
			} else {
				result = await getEvmBalance(address, selectedNetwork);
			}
			
			balance = result.balance;
			symbol = result.symbol;
		} catch (err) {
			error = 'Failed to fetch balance';
			console.error('Balance fetch error:', err);
		} finally {
			loading = false;
		}
	}

	// Refresh balance when chain or network changes
	$effect(() => {
		if (address) {
			fetchBalance();
		}
	});

	// Auto-refresh every 30 seconds - using $effect with cleanup
	$effect(() => {
		const interval = setInterval(() => {
			if (address && !loading) {
				fetchBalance();
			}
		}, 30000);

		// Return cleanup function
		return () => clearInterval(interval);
	});

	// Format balance for display
	function formatBalance(bal: string): string {
		const num = parseFloat(bal);
		if (num === 0) return '0.0';
		if (num < 0.0001) return '< 0.0001';
		if (num < 1) return num.toFixed(4);
		if (num < 1000) return num.toFixed(2);
		return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
	}
</script>

<div class="flex items-center justify-between py-2">
	<div class="flex items-center gap-2">
		<div class="w-8 h-8 rounded-full bg-gradient-to-r {chain === 'solana' ? 'from-purple-500 to-blue-500' : 'from-blue-500 to-cyan-500'} flex items-center justify-center">
			<span class="text-white font-bold text-xs">
				{chain === 'solana' ? '◎' : 'Ξ'}
			</span>
		</div>
		<div>
			<div class="font-medium text-sm text-white">
				{chain === 'solana' ? 'Solana' : NETWORK_CONFIGS[selectedNetwork]?.name || 'EVM Network'}
			</div>
			<div class="text-xs text-gray-400">
				{chain === 'solana' ? 'Mainnet' : NETWORK_CONFIGS[selectedNetwork]?.isTestnet ? 'Testnet' : 'Mainnet'}
			</div>
		</div>
	</div>
	
	<div class="text-right">
		{#if loading}
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
				<span class="text-xs text-gray-400">Loading...</span>
			</div>
		{:else if error}
			<div class="text-xs text-red-400">Error</div>
		{:else}
			<div class="font-medium text-sm text-white">
				{formatBalance(balance)} {symbol}
			</div>
			<div class="text-xs text-gray-400">
				{chain === 'solana' ? 'Native Balance' : 'Native Balance'}
			</div>
		{/if}
	</div>
</div>
