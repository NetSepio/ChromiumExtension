<script lang="ts">
	import { NETWORK_CONFIGS, type NetworkType } from '$lib/helpers/solanaTransactions';

	export let networkType: NetworkType = 'mainnet';
	export let showDetails: boolean = false;

	$: config = NETWORK_CONFIGS[networkType];
	$: statusColor =
		networkType === 'mainnet'
			? 'bg-green-500'
			: networkType === 'testnet'
				? 'bg-yellow-500'
				: 'bg-blue-500';
	$: textColor =
		networkType === 'mainnet'
			? 'text-green-400'
			: networkType === 'testnet'
				? 'text-yellow-400'
				: 'text-blue-400';
</script>

<div class="flex items-center gap-2">
	<span class="size-2 rounded-full {statusColor}"></span>
	<span class="text-sm capitalize {showDetails ? textColor : 'text-white'}">{config.name}</span>
	{#if showDetails}
		<div class="text-xs text-gray-400">
			({networkType})
		</div>
	{/if}
</div>

{#if showDetails}
	<div class="mt-2 text-xs text-gray-400">
		<div>Network: {config.name}</div>
		<div>
			Explorer: <a
				href={config.explorerUrl}
				target="_blank"
				class="text-[#00ccba] hover:text-[#00eeda]">View</a
			>
		</div>
	</div>
{/if}
