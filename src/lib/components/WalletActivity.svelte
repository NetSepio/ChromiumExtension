<script lang="ts">
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { Provider, Network } from 'aptos';
	// import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	// import { jwtToken } from '$lib/store/store';

	let transactions: any = [];
	let userWalletAddress: any;

	walletAddress.subscribe((value) => (userWalletAddress = value));

	const getTransactions = async () => {
		const provider = new Provider(Network.TESTNET);
		transactions = await provider.getAccountTransactions(userWalletAddress);
	};

	// const getUserDetails = async () => {
	// 	let token = '';

	// 	jwtToken.subscribe((val) => (token = val));

	// 	const options = {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: `Bearer ${token}`
	// 		}
	// 	};

	// 	const response = await fetch(
	// 		`${PUBLIC_GATEWAY_URL}/reviewerdetails?walletAddress=${userWalletAddress}`,
	// 		options
	// 	);

	// 	const result = await response.json();
	// 	console.log(result);
	// 	console.log(response);
	// };

	onMount(() => {
		getTransactions();
		// getUserDetails();
	});
</script>

<!-- <div class="flex flex-col mb-4">
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
						<td class="py-2">4</td>

						<td class="py-2">stackoverflow.com</td>
						<td class="py-2">
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
		<h1 class="text-lg text-center">No data to show</h1>
	{/if}
</div> -->
