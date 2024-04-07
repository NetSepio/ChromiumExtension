<!-- WalletAssets component -->
<script lang="ts">
	// Importing necessary Svelte components and utilities
	import {
		ACCOUNT_TRANSACTIONS_QUERY,
		COIN_ACTIVITY,
		GET_THIS_USER_NFTS
	} from '$lib/graphql/queries';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';
	import { removePrefix } from '$lib/utils';

	// Component-level state and variables
	export let assets: any = [];
	let showModal = false;
	let address = '';

	// Fetch user's NFTs on component mount
	onMount(async () => {
		// Subscribe to changes in the wallet address
		walletAddress.subscribe((u) => (address = u));

		// Fetch NFT data using GraphQL query

		// Assign fetched data to the assets variable
		// assets = tempData.reviewCreateds;
	});
</script>

<!-- HTML structure -->
<div class="flex flex-grow flex-col mb-4">
	{#if assets.length === 0}
		<!-- {#if true} -->
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
			<h1 class="text-lg text-center p-3">No Assets Found</h1>
			<!-- <h1 class="text-lg text-center p-3">Comming Soon</h1> -->

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
		<div class="w-full">
			{#each assets as asset}
				<!-- <p>
					{asset.current_token_data.token_uri
						.slice(0, 4)
						.concat(asset.current_token_data.token_uri.slice(6))
						.replace(/\.json$/, '.jpg')}
				</p> -->
				<!-- <img
					width="60"
					height="60"
					src={`${'https://nftstorage.link/ipfs'}/${removePrefix(
						asset.current_token_data.token_uri
					)}`}
					alt="nft_img"
				/> -->
				<div>
					<p>{asset.current_token_data.token_name}</p>
					<img
						width="60"
						height="60"
						src={asset?.current_token_data.cdn_asset_uris?.cdn_image_uri}
						alt="lnls"
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
<!-- src={`https://cloudflare-ipfs.com/${asset.current_token_data.token_uri
						.slice(0, 4)
						.concat(asset.current_token_data.token_uri.slice(6))
						.replace(/\.json$/, '.jpg')}`} -->
