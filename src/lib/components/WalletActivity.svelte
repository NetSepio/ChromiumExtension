<script>
	const transactions = [
		{
			type: 'Send',
			asset: 'BTC',
			amount: '0.1',
			date: 'Jan 1, 2021'
		},
		{
			type: 'Receive',
			asset: 'ETH',
			amount: '0.5',
			date: 'Jan 2, 2021'
		}
	];
</script>

<div class="flex flex-col mb-4">
	<label class="text-lg font-bold mb-2" for="transactions-table">Activity</label>
	<table class="w-full" id="transactions-table">
		<thead>
			<tr>
				<th class="px-4 py-2">Type</th>
				<th class="px-4 py-2">Asset</th>
				<th class="px-4 py-2">Amount</th>
				<th class="px-4 py-2">Date</th>
			</tr>
		</thead>
		<tbody>
			{#each transactions as transaction}
				<tr>
					<td class="px-4 py-2">{transaction.type}</td>
					<td class="px-4 py-2">{transaction.asset}</td>
					<td class="px-4 py-2">{transaction.amount}</td>
					<td class="px-4 py-2">{transaction.date}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
