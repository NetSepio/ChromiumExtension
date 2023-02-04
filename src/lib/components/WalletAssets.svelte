<script lang="ts">
	import { walletAddress } from '$lib/store/store';
	import { PUBLIC_ETHERSCAN_API_KEY } from '$env/static/public';
	import { onMount } from 'svelte';

	let assets: any = [];
	let showModal = false;
	async function getTokenAddresses(address: string) {
		const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${PUBLIC_ETHERSCAN_API_KEY}`;

		const response = await fetch(url);
		const json = await response.json();
		const tokenAddresses = Array.from(new Set(json.result.map((tx: any) => tx.contractAddress)));

		console.log('Token addresses:', tokenAddresses);
		assets = json.result;
	}

	onMount(() => {
		getTokenAddresses($walletAddress as string);
	});
</script>

<div class="flex flex-col mb-4">
	<button class="text-lg font-bold mb-2 dark:text-white">Assets</button>

	{#if assets.length === 0}
		<div>
			<!-- <button
				class="modal-button btn px-4 py-2 rounded-md shadow-lg bg-zinc-700 text-white dark:bg-gray-900 dark:text-white"
				on:click={() => (showModal = true)}
			>
				Import Token
			</button> -->
			<h1 class="text-lg p-3">No Assets Found</h1>
			<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
				<div class="modal-box dark:bg-gray-900 dark:text-white">
					<button
						class="btn btn-sm btn-circle absolute right-2 top-2"
						on:click={() => (showModal = false)}
					>
						✕
					</button>
					<h3 class="font-bold text-3xl mt-5">Add your token</h3>
					<!-- Token Contract Address -->
					<p class="text-md mt-5 mb-3">Token Contract Address</p>
					<input
						type="text"
						placeholder="Token Contract Address"
						class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					/>
					<!-- Token Symbol -->
					<p class="text-md mt-1 mb-3">Token Symbol</p>
					<input
						type="text"
						placeholder="Token Symbol"
						class="input input-bordered input-md dark:bg-gray-900 dark:text-white dark:border-zinc-600 w-full max-w-xs"
					/>
					<!-- Token Decimal -->
					<p class="text-md mt-1 mb-3">Token Decimal</p>
					<input
						type="text"
						placeholder="Token Decimal"
						class="input input-bordered input-md dark:bg-gray-900 dark:text-white dark:border-zinc-600 w-full max-w-xs"
					/>
					<div class="modal-action">
						<button class="btn" on:click={() => (showModal = false)}> Add Token </button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<table class="w-full">
			<thead>
				<tr>
					<th class="px-4 py-2">Name</th>
					<th class="px-4 py-2">Symbol</th>
					<th class="px-4 py-2">Balance</th>
				</tr>
			</thead>
			<tbody>
				{#each assets as asset}
					<tr>
						<td class="px-4 py-2">{asset.name}</td>
						<td class="px-4 py-2">{asset.symbol}</td>
						<td class="px-4 py-2">{asset.balance}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
