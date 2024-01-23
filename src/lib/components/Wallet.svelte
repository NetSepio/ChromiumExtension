<!-- Wallet component -->
<script lang="ts">
	// Importing necessary Svelte components and external dependencies
	import WalletProfile from '$lib/components/WalletProfile.svelte';
	import WalletActivity from '$lib/components/WalletActivity.svelte';
	import WalletAssets from '$lib/components/WalletAssets.svelte';
	import { PUBLIC_NODE_URL } from '$env/static/public';
	import { AptosClient, CoinClient } from 'aptos';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';

	// Component-level state and variables
	let showAssets = false;
	let userWalletAddress = '';
	let balance: any;
	let isLoading = false;

	// Subscribe to changes in walletAddress store
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// Function to retrieve wallet balance
	const getBalance = async () => {
		isLoading = true;

		try {
			// Initialize AptosClient and CoinClient for retrieving the wallet balance
			const client = new AptosClient(PUBLIC_NODE_URL);
			const coinClient = new CoinClient(client);
			let newBalance = await coinClient.checkBalance(userWalletAddress);
			balance = Number(newBalance);
		} catch (error) {
			// Handle errors, set the balance to 0 in case of an error
			if (error) {
				balance = 0;
			}
			console.log(error);
		} finally {
			isLoading = false;
		}
	};

	// Trigger getBalance on component mount
	onMount(async () => {
		await getBalance();
	});
</script>

<!-- HTML structure -->
<div class="flex flex-col">
	<!-- Display WalletProfile component with the current balance -->
	<WalletProfile {balance} />
	<br />

	<!-- Buttons to switch between Assets and Activity views -->
	<!-- <div class="flex justify-between mb-4">
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
	</div> -->

	<!-- Conditionally render WalletAssets or WalletActivity components based on showAssets -->
	<!-- {#if showAssets}
		<WalletAssets />
	{:else} -->
	<!-- <WalletActivity /> -->
	<!-- {/if} -->

	<!-- Loader modal displayed while loading -->
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>
