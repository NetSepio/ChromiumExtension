<script>
	let assets = [];
	let showModal = false;
</script>

<div class="flex flex-col mb-4">
	<button class="text-lg font-bold mb-2">Assets</button>

	{#if assets.length === 0}
		<div>
			<button
				class="modal-button btn px-4 py-2 rounded-md shadow-lg bg-zinc-700 text-white"
				on:click={() => (showModal = true)}
			>
				Import Token
			</button>
			<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
				<div class="modal-box">
					<button
						class="btn btn-sm btn-circle absolute right-2 top-2"
						on:click={() => (showModal = false)}
					>
						✕
					</button>
					<h3 class="font-bold text-3xl mt-5">Add your token</h3>
					<!-- Token Contract Address -->
					<p class="text-md mt-5 mb-3">Token Contract Address</p>
					<input
						type="text"
						placeholder="Token Contract Address"
						class="input input-bordered input-md w-full max-w-xs"
					/>
					<!-- Token Symbol -->
					<p class="text-md mt-1 mb-3">Token Symbol</p>
					<input
						type="text"
						placeholder="Token Symbol"
						class="input input-bordered input-md w-full max-w-xs"
					/>
					<!-- Token Decimal -->
					<p class="text-md mt-1 mb-3">Token Decimal</p>
					<input
						type="text"
						placeholder="Token Decimal"
						class="input input-bordered input-md w-full max-w-xs"
					/>
					<div class="modal-action">
						<button class="btn" on:click={() => (showModal = false)}> Add Token </button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<table class="w-full">
			<thead>
				<tr>
					<th class="px-4 py-2">Name</th>
					<th class="px-4 py-2">Symbol</th>
					<th class="px-4 py-2">Balance</th>
				</tr>
			</thead>
			<tbody>
				{#each assets as asset}
					<tr>
						<td class="px-4 py-2">{asset.name}</td>
						<td class="px-4 py-2">{asset.symbol}</td>
						<td class="px-4 py-2">{asset.balance}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
