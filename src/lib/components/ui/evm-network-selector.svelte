<script lang="ts">
	import { ChevronDown, Wifi } from '@lucide/svelte';
	import { getAvailableEvmNetworks, getNetworkConfig, getNetworkColor } from '$lib/utils/evm-networks';
	import type { NetworkOption } from '$lib/utils/evm-networks';

	interface Props {
		selectedNetwork: string;
		onNetworkChange: (networkId: string) => void;
		disabled?: boolean;
	}

	let { selectedNetwork, onNetworkChange, disabled = false }: Props = $props();

	let showDropdown = $state(false);
	let networks = $derived(getAvailableEvmNetworks());
	let currentNetwork = $derived(getNetworkConfig(selectedNetwork));

	function selectNetwork(networkId: string) {
		if (networkId !== selectedNetwork) {
			onNetworkChange(networkId);
		}
		showDropdown = false;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (showDropdown && !target.closest('.network-dropdown')) {
			showDropdown = false;
		}
	}

	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="network-dropdown relative">
	<button
		onclick={() => !disabled && (showDropdown = !showDropdown)}
		disabled={disabled}
		class="flex w-full items-center justify-between rounded-lg border border-[#404040] bg-[#2a2a2a] px-3 py-2 text-sm transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50"
	>
		<div class="flex items-center gap-2">
			<div 
				class="h-3 w-3 rounded-full" 
				style="background-color: {getNetworkColor(selectedNetwork)}"
			></div>
			<div class="flex items-center gap-1">
				<Wifi size="14" color={currentNetwork?.isTestnet ? '#fbbf24' : '#10b981'} />
				<span class="font-medium">
					{currentNetwork?.name || 'Unknown Network'}
				</span>
			</div>
			{#if currentNetwork?.isTestnet}
				<span class="rounded bg-yellow-500/20 px-1 py-0.5 text-[10px] text-yellow-400">
					Testnet
				</span>
			{/if}
		</div>
		<ChevronDown 
			size="16" 
			class="text-gray-400 transition-transform {showDropdown ? 'rotate-180' : ''}"
		/>
	</button>

	{#if showDropdown}
		<div class="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border border-[#404040] bg-[#202222] shadow-lg shadow-[#070404]">
			<div class="max-h-48 overflow-y-auto p-1">
				{#each networks as network (network.id)}
					<button
						onclick={() => selectNetwork(network.id)}
						class="flex w-full items-center justify-between rounded-md p-2 text-left text-sm transition-colors hover:bg-[#333333] {network.id === selectedNetwork ? 'bg-[#333333] text-[#00ccba]' : 'text-white'}"
					>
						<div class="flex items-center gap-2">
							<div 
								class="h-2.5 w-2.5 rounded-full" 
								style="background-color: {getNetworkColor(network.id)}"
							></div>
							<div class="flex items-center gap-1.5">
								<Wifi size="12" color={network.isTestnet ? '#fbbf24' : '#10b981'} />
								<span class="font-medium">{network.name}</span>
							</div>
							{#if network.isTestnet}
								<span class="rounded bg-yellow-500/20 px-1 py-0.5 text-[9px] text-yellow-400">
									Test
								</span>
							{/if}
						</div>
						<div class="text-right">
							<div class="text-xs text-gray-400">{network.symbol}</div>
							{#if network.id === selectedNetwork}
								<div class="text-[10px] text-[#00ccba]">Selected</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

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
</style>
