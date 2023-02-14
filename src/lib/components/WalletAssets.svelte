<script lang="ts">
	import { GET_THIS_USER_NFTS } from '$lib/graphql/queries';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';

	let assets: any = [];
	let showModal = false;
	let address = '';

	onMount(async () => {
		walletAddress.subscribe((u) => (address = u));
		let tempData = await fetchGraphQLData(GET_THIS_USER_NFTS, { walletAddress: address });
		assets = tempData.reviewCreateds;
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
					<th class="px-4 py-2">TokenId</th>
					<th class="px-4 py-2">Domain</th>
					<th class="px-4 py-2">Meta Data</th>
				</tr>
			</thead>
			<tbody>
				{#each assets as asset}
					<tr>
						<td class="px-4 py-2">{asset.tokenId}</td>
						<td class="px-4 py-2">{asset.domainAddress}</td>
						<td class="px-4 py-2"
							><a
								href={`https://ipfs.io/ipfs/${asset.metadataURI?.substring(7)}`}
								target="_blank"
								rel="noreferrer"
								class="font-semibold text-green-500">SHOW</a
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
