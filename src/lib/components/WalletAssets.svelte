<!-- WalletAssets component -->
<script lang="ts">
	// Importing necessary Svelte components and utilities
	import { GET_THIS_USER_NFTS } from '$lib/graphql/queries';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';

	// Component-level state and variables
	let assets: any = [];
	let showModal = false;
	let address = '';

	// Fetch user's NFTs on component mount
	onMount(async () => {
		// Subscribe to changes in the wallet address
		walletAddress.subscribe((u) => (address = u));

		// Fetch NFT data using GraphQL query
		let tempData = await fetchGraphQLData(GET_THIS_USER_NFTS, { walletAddress: address });

		// Assign fetched data to the assets variable
		assets = tempData.reviewCreateds;
	});
</script>

<!-- HTML structure -->
<div class="flex flex-col mb-4">
	<!-- Section heading -->
	<button class="text-lg font-bold mb-2 dark:text-white">Your NFTs</button>

	{#if assets.length === 0}
		<!-- Display when no assets are found -->
		<div>
			<!-- 
            <button
                class="modal-button btn px-4 py-2 rounded-md shadow-lg bg-zinc-700 text-white dark:bg-gray-900 dark:text-white"
                on:click={() => (showModal = true)}
            >
                Import Token
            </button>
            -->

			<!-- Display a message when no assets are found -->
			<h1 class="text-lg p-3">No Assets Found</h1>

			<!-- Modal for adding a new token -->
			<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
				<div class="modal-box dark:bg-gray-900 dark:text-white">
					<button
						class="btn btn-sm btn-circle absolute right-2 top-2"
						on:click={() => (showModal = false)}
					>
						✕
					</button>
					<h3 class="font-bold text-3xl mt-5">Add your token</h3>

					<!-- Token Contract Address input -->
					<p class="text-md mt-5 mb-3">Token Contract Address</p>
					<input
						type="text"
						placeholder="Token Contract Address"
						class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					/>

					<!-- Token Symbol input -->
					<p class="text-md mt-1 mb-3">Token Symbol</p>
					<input
						type="text"
						placeholder="Token Symbol"
						class="input input-bordered input-md dark:bg-gray-900 dark:text-white dark:border-zinc-600 w-full max-w-xs"
					/>

					<!-- Token Decimal input -->
					<p class="text-md mt-1 mb-3">Token Decimal</p>
					<input
						type="text"
						placeholder="Token Decimal"
						class="input input-bordered input-md dark:bg-gray-900 dark:text-white dark:border-zinc-600 w-full max-w-xs"
					/>

					<!-- Modal action button to add the token -->
					<div class="modal-action">
						<button class="btn" on:click={() => (showModal = false)}> Add Token </button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Display NFTs in a table when assets are present -->
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
						<!-- Displaying asset details in each row -->
						<td class="px-4 py-2">{asset.tokenId}</td>
						<td class="px-4 py-2">{asset.domainAddress}</td>
						<td class="px-4 py-2">
							<!-- Link to view the asset on OpenSea -->
							<a
								href={`https://testnets.opensea.io/assets/mumbai/0x67d3104dddd78a8f04fb445f689fccf4916a2d20/${asset.tokenId}`}
								target="_blank"
								rel="noreferrer"
								class="font-semibold text-green-500">SHOW</a
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
