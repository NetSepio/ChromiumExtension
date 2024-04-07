<!-- Wallet component -->
<script lang="ts">
	// Importing necessary Svelte components and external dependencies
	import WalletProfile from '$lib/components/WalletProfile.svelte';
	import WalletActivity from '$lib/components/WalletActivity.svelte';
	import WalletAssets from '$lib/components/WalletAssets.svelte';
	import { testnet, userBalance, walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';
	import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
	import { COIN_ACTIVITY, TOKENS } from '$lib/graphql/queries';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';

	// Component-level state and variables
	let showAssets = !false;
	let userWalletAddress = '';
	let balance = 0;
	let isLoading = false;
	let appIsTestnet = true;
	let transactions: any[];
	let assets: any[];

	// Subscribe to changes in walletAddress store
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// Function to retrieve wallet balance
	const getBalance = async () => {
		isLoading = true;
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);
		try {
			let newBalance = await aptos.getAccountAPTAmount({ accountAddress: userWalletAddress });
			balance = Number(newBalance);
			userBalance.set(JSON.stringify(Number(newBalance)));
			localStorage.setItem('balance', JSON.stringify(balance));
			console.log(balance, appIsTestnet, app);
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

	const getTransactions = async () => {
		isLoading = true;

		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		// Fetch transactions for the userWalletAddress
		transactions = (
			await fetchGraphQLData(
				COIN_ACTIVITY,
				{
					owner_address: userWalletAddress,
					offset: 0
				},
				`https://api.${app}.aptoslabs.com/v1/graphql`
			)
		).coin_activities;
		// console.log(transactions, userWalletAddress);
		isLoading = false;
	};

	const getResource = async () => {
		isLoading = true;
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		assets = (
			await fetchGraphQLData(
				TOKENS,
				{ owner_address: userWalletAddress },
				`https://api.${app}.aptoslabs.com/v1/graphql`
			)
		).current_token_ownerships_v2;
		console.log('assets', assets);

		isLoading = !true;
	};

	// Trigger getBalance on component mount
	onMount(async () => {
		await getBalance();
		await getTransactions();
		await getResource();
	});
</script>

<!-- HTML structure -->
<div class="flex w-[100%] h-full flex-grow mx-auto flex-col">
	<!-- Display WalletProfile component with the current balance -->
	<WalletProfile {getBalance} {getTransactions} />
	<div class="flex w-full h-[50%] flex-col justify-around">
		<!-- Buttons to switch between Assets and Activity views -->
		<div class="flex w-full h-[15%] justify-around">
			<button
				class={`px-1 py-2 w-[40%]   ${
					showAssets
						? 'border-b border-opacity-50 border-secondary dark:border-action text-secondary dark:bg-transparent dark:text-action'
						: 'text-gray-700 dark:text-white'
				}`}
				on:click={() => (showAssets = true)}
			>
				NFTs
			</button>
			<button
				class={`px-1 py-2 w-[40%]  ${
					!showAssets
						? 'text-secondary  border-b border-opacity-50 border-secondary dark:border-action dark:bg-transparent dark:text-action'
						: 'text-gray-700 dark:text-white'
				}`}
				on:click={() => (showAssets = false)}
			>
				Activity
			</button>
		</div>

		<div class="h-[85%]">
			<!-- Loader modal displayed while loading -->
			{#if isLoading}
				<div class="h-[50%]">
					<Loader />
				</div>
				<!-- Conditionally render WalletAssets or WalletActivity components based on showAssets -->
			{:else if showAssets}
				<WalletAssets {assets} />
			{:else}
				<WalletActivity app={appIsTestnet ? Network.TESTNET : Network.MAINNET} {transactions} />
			{/if}
		</div>
	</div>
</div>
