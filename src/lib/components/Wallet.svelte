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
	import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

	import { Transaction } from '@mysten/sui/transactions';

	// Component-level state and variables
	let showAssets = $state(!false);
	let userWalletAddress = '';
	let balance = $state(0);
	let isLoading = $state(false);
	let appIsTestnet = $state(true);
	let transactions: any[];
	let assets: any[] = $state();

	// Subscribe to changes in walletAddress store
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// use getFullnodeUrl to define Devnet RPC location
	const rpcUrl = getFullnodeUrl('devnet');
	const tx = new Transaction();

	// create a client connected to devnet
	const client = new SuiClient({ url: rpcUrl });

	// get coins owned by an address
	// replace <OWNER_ADDRESS> with actual address in the form of 0x123...

	// Function to retrieve wallet balance
	const getBalance = async () => {
		isLoading = true;

		try {
			let newBalance = await client.getBalance({
				owner: userWalletAddress
			});

			balance = Number(newBalance.totalBalance);
			userBalance.set(JSON.stringify(Number(newBalance)));
			localStorage.setItem('balance', JSON.stringify(balance));
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

		// Fetch transactions for the userWalletAddress
		// transactions =
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
		).current_token_ownerships_v2.filter((item: any) => item.amount > 0);
		console.log('assets', assets);

		isLoading = !true;
	};

	// Trigger getBalance on component mount
	onMount(async () => {
		await getBalance();
		// await getTransactions();
		// await getResource();
	});
</script>

<!-- HTML structure -->
<div class="flex w-[100%] h-full flex-grow mx-auto flex-col">
	<!-- Display WalletProfile component with the current balance -->
	<WalletProfile {balance} />
	<div class="flex w-full h-[50%] flex-col justify-around">
		<!-- Buttons to switch between Assets and Activity views -->
		<div class="flex w-full h-[15%] justify-around">
			<button
				class={`px-1 py-2 w-[40%]   ${
					showAssets
						? 'border-b border-opacity-50 border-secondary dark:border-action text-secondary dark:bg-transparent dark:text-action'
						: 'text-gray-700 dark:text-white'
				}`}
				onclick={() => (showAssets = true)}
			>
				NFTs
			</button>
			<button
				class={`px-1 py-2 w-[40%]  ${
					!showAssets
						? 'text-secondary  border-b border-opacity-50 border-secondary dark:border-action dark:bg-transparent dark:text-action'
						: 'text-gray-700 dark:text-white'
				}`}
				onclick={() => (showAssets = false)}
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
				<WalletActivity app={appIsTestnet ? Network.DEVNET : Network.MAINNET} {transactions} />
			{/if}
		</div>
	</div>
</div>
