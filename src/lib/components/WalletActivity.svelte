<script lang="ts">
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { Provider, Network, AptosAccount } from 'aptos';

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
	<label class="text-2xl font-bold mb-4 text-center" for="transactions-table">Your Reviews</label>
	{#if transactions.length > 0}
		<table class="w-full" id="transactions-table">
			<thead>
				<tr class="text-xm">
					<th class="py-2">Token Id</th>
					<th class="py-2">Domain</th>
					<th class="py-2">Metadata</th>
				</tr>
			</thead>
			<tbody>
				{#each transactions as transaction}
					<tr>
						<td class="py-2">4</td>

						<td class="py-2">stackoverflow.com</td>
						<td class="py-2">
							<a
								class="no-underline cursor-pointer uppercase text-[#263238] dark:text-[#11D9C5]"
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
		<h1 class="text-lg text-center">No data to show</h1>
	{/if}
</div>
