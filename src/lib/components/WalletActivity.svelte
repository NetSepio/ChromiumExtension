<script lang="ts">
	import { walletAddress } from '$lib/store/store';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	let transactionHistory: any = [];
	const getTransactionHistory = async (address: string) => {
		const provider = new ethers.providers.EtherscanProvider('mainnet');
		transactionHistory = await provider.getHistory(address);
		console.log(transactionHistory);
	};
	onMount(() => {
		getTransactionHistory($walletAddress);
	});
</script>

<div class="flex flex-col mb-4">
	<label class="text-lg font-bold mb-2" for="transactions-table">Activity</label>
	{#if transactionHistory.length > 0}
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
				{#each transactionHistory as transaction}
					<tr>
						{#if transaction.from == $walletAddress}
							<td class="px-4 py-2">Sent</td>
						{:else if transaction.from !== $walletAddress}
							<td class="px-4 py-2">Received</td>
						{/if}
						<td class="px-4 py-2">{transaction.hash.substring(0, 6) + '...'}</td>
						<td class="px-4 py-2">
							{parseInt(transaction.value._hex, 16) / 10 ** 18} ETH
						</td>
						<td class="px-4 py-2">
							{new Date(transaction.timestamp * 1000).toLocaleString()}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<h1 class="text-lg text-center">No data to show</h1>
	{/if}
</div>
