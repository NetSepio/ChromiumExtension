<script lang="ts">
	import { page } from '$app/stores';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { Provider, Network } from 'aptos';
	import Loader from '../../../lib/components/Loader.svelte';

	let transaction: any = [];
	let userWalletAddress: any;

	let { params } = $page;
	let isLoading = false;

	walletAddress.subscribe((value) => (userWalletAddress = value));

	const getTransaction = async () => {
		isLoading = true;
		try {
			const provider = new Provider(Network.TESTNET);
			transaction = await provider.getTransactionByHash(params.hash);
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}

		console.log(transaction);
	};

	onMount(() => {
		getTransaction();
	});
</script>

<div class="p-8">
	<h1 class="text-center font-bold">Transaction Details</h1>
	<div class="p-4 my-8 border border-white rounded-lg">
		<div class="flex gap-4">
			<h3 class="basis-1/4">Sender:</h3>
			{#if transaction.sender}
				<p>{transaction?.sender.substring(0, 6) + '...'}</p>
			{/if}
		</div>
		<div class="flex gap-4">
			<h3 class="basis-1/4">Hash:</h3>
			{#if transaction.hash}
				<p>{transaction?.hash.substring(0, 8) + '...'}</p>
			{/if}
		</div>
		<div class="flex gap-4">
			<h3 class="basis-1/4">Gas:</h3>
			<p>{transaction.gas_unit_price}</p>
		</div>
		<div class="flex gap-4">
			<h3 class="basis-1/4">Amount:</h3>
			{#if transaction.payload && transaction.payload.arguments}
				<p>{(parseInt(transaction?.payload.arguments[1]) / 100000)}</p>
			{/if}
		</div>
		<div class="flex gap-4">
			<h3 class="basis-1/4">Receiver:</h3>
			{#if transaction.payload && transaction.payload.arguments}
				<p>{parseInt(transaction?.payload.arguments[0]).toString().substring(0, 8) + '...'}</p>
			{/if}
		</div>
	</div>
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>
