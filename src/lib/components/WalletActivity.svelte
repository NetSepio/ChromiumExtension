<!-- Wallet Activity component -->
<script lang="ts">
	// Importing necessary Svelte components and external dependencies
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { Provider, Network } from 'aptos';

	// Component-level state and variables
	let transactions: any = [];
	let userWalletAddress: any;

	// Subscribe to changes in walletAddress store
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// Function to retrieve wallet transactions
	const getTransactions = async () => {
		// Initialize Aptos provider with the TESTNET network
		const provider = new Provider(Network.TESTNET);

		// Fetch transactions for the userWalletAddress
		transactions = await provider.getAccountTransactions(userWalletAddress);
	};

	// Lifecycle hook to trigger getTransactions on component mount
	onMount(() => {
		getTransactions();
	});
</script>

<!-- HTML structure -->

<div class="flex flex-col mb-4">
	<label class="text-2xl font-bold mb-4 text-center" for="transactions-table">Your Reviews</label>
	{#if transactions.length > 0}
		<table class="w-full" id="transactions-table">
			<thead>
				<tr class="text-xs">
					<th class="py-2">Token Id</th>
					<th class="py-2">Domain</th>
					<th class="py-2">Metadata</th>
				</tr>
			</thead>
			<tbody>
				{#each transactions as transaction}
					<tr>
						<!-- Displaying transaction details -->
						<td class="py-2">4</td>

						<td class="py-2">stackoverflow.com</td>
						<td class="py-2">
							<!-- Link to view transaction details -->
							<a
								class="text-sm no-underline cursor-pointer uppercase text-[#263238] dark:text-[#11D9C5]"
								href={`/transaction/${transaction.hash}`}
							>
								show
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<!-- Displayed when there are no transactions -->
		<h1 class="text-lg text-center">No data to show</h1>
	{/if}
</div>
