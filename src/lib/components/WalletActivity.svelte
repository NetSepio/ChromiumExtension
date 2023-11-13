<script lang="ts">
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { Provider, Network } from 'aptos';

	let transactions: any = [];
	let userWalletAddress: any;

	walletAddress.subscribe((value) => (userWalletAddress = value));

	const getTransactions = async () => {
		const provider = new Provider(Network.TESTNET);
		transactions = await provider.getAccountTransactions(userWalletAddress);
	
	};

	onMount(() => {
		getTransactions();
	});
</script>

<div class="flex flex-col mb-4">
	<label class="text-lg font-bold mb-2" for="transactions-table">Activity</label>
	{#if transactions.length > 0}
		<table class="w-full" id="transactions-table">
			<thead>
				<tr>
					<th class="px-4 py-2">Type</th>
					<th class="px-4 py-2">Hash</th>
					<th class="px-4 py-2">Amount</th>
					<th class="px-4 py-2">Date</th>
				</tr>
			</thead>
			<tbody>
				{#each transactions as transaction}
			
						<tr>
							{#if transaction.sender === userWalletAddress}
								<td class="px-4 py-2">Sent</td>
							{:else if transaction.sender !== userWalletAddress}
								<td class="px-4 py-2">Received</td>
							{/if}
							<td class="px-4 py-2">{transaction.hash.substring(0, 6) + '...'}</td>
							<td class="px-4 py-2">
								<a class="no-underline cursor-pointer" href={`/transaction/${transaction.hash}`}>
								{(parseInt(transaction.payload.arguments[1]) / 100000)} APTOS
								</a>
							</td>
							<td class="px-4 py-2">
								{new Date(parseInt(transaction.timestamp)/1000).toLocaleDateString()}
							</td>
						</tr>
		
				{/each}
			</tbody>
		</table>
	{:else}
		<h1 class="text-lg text-center">No data to show</h1>
	{/if}
</div>
