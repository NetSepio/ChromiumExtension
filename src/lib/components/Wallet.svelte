<script lang="ts">
	import WalletProfile from '$lib/components/WalletProfile.svelte';
	import WalletActivity from '$lib/components/WalletActivity.svelte';
	import WalletAssets from '$lib/components/WalletAssets.svelte';
	import { PUBLIC_NODE_URL } from '$env/static/public';
	import { AptosAccount, AptosClient, CoinClient } from 'aptos';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';

	let showAssets = false;
	let userWalletAddress = '';
	let balance: any;
	let isLoading = false;

	walletAddress.subscribe((value) => (userWalletAddress = value));

	// making transactions
	const getBalance = async () => {
		isLoading = true;

		try {
			const client = new AptosClient(PUBLIC_NODE_URL);
			// Create client for working with the coin module.
			const coinClient = new CoinClient(client);
			let newBalance = await coinClient.checkBalance(userWalletAddress);
			balance = Number(newBalance);
		} catch (error) {
			if (error) {
				balance = 0;
			}

			console.log(error);
		} finally {
			isLoading = false;
		}
	};

	onMount(async () => {
		await getBalance();
	});
</script>

<div class="flex flex-col">
	<WalletProfile {balance} />
	<br />
	<div class="flex justify-between mb-4">
		<button
			class={`px-4 py-2 rounded-md ${
				showAssets
					? 'bg-zinc-700 text-white dark:bg-transparent dark:text-white'
					: 'text-gray-700 dark:text-white'
			}`}
			on:click={() => (showAssets = true)}
		>
			Assets
		</button>
		<button
			class={`px-4 py-2 rounded-md dark:bg-transparent dark:text-white ${
				!showAssets ? 'text-white dark:text-white' : 'text-gray-700 dark:text-white'
			}`}
			on:click={() => (showAssets = false)}
		>
			Activity
		</button>
	</div>
	{#if showAssets}
		<WalletAssets />
	{:else}
		<WalletActivity />
	{/if}
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>
