<!-- Transaction page -->
<script lang="ts">
	// Import necessary modules and components
	import { page } from '$app/stores';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { Provider, Network } from 'aptos';
	import Loader from '../../../lib/components/Loader.svelte';

	// Declare variables and initialize them
	let transaction: any = [];
	let userWalletAddress: any;

	// Destructure params from $page
	let { params } = $page;

	// Variable to track loading state
	let isLoading = false;

	// Subscribe to changes in the wallet address
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// Function to fetch transaction details
	const getTransaction = async () => {
		// Set loading state to true
		isLoading = true;
		try {
			// Create a new provider instance with the testnet network
			const provider = new Provider(Network.TESTNET);
			// Fetch transaction details using the transaction hash from params
			transaction = await provider.getTransactionByHash(params.hash);
		} catch (error) {
			// Handle errors if any
			// console.log(error);
		} finally {
			// Set loading state to false regardless of success or failure
			isLoading = false;
		}
	};

	// Call getTransaction function on component mount
	onMount(() => {
		getTransaction();
	});
</script>

<!-- Main content for the Transaction page -->
<div class="p-8">
	<!-- Link to go back to the wallet page -->
	<a href="/wallet" class="text-gray-900 dark:text-white no-underline">Back</a>

	<!-- Title for the Transaction Details section -->
	<h3 class="text-center font-bold">Transaction Details</h3>

	<!-- Container for displaying transaction details -->
	<div class="p-4 my-8 border border-white rounded-lg">
		<!-- Sender information -->
		<div class="flex gap-4">
			<h3 class="basis-1/4">Sender:</h3>
			{#if transaction.sender}
				<p>{transaction?.sender.substring(0, 6) + '......' + transaction?.sender.slice(-4)}</p>
			{/if}
		</div>

		<!-- Hash information -->
		<div class="flex gap-4">
			<h3 class="basis-1/4">Hash:</h3>
			{#if transaction.hash}
				<p>{transaction?.hash.substring(0, 8) + '......' + transaction?.hash.slice(-4)}</p>
			{/if}
		</div>

		<!-- Gas information -->
		<div class="flex gap-4">
			<h3 class="basis-1/4">Gas:</h3>
			<p>{transaction.gas_unit_price}</p>
		</div>

		<!-- Amount information -->
		<div class="flex gap-4">
			<h3 class="basis-1/4">Amount:</h3>
			{#if transaction.payload && transaction.payload.arguments}
				<p>{parseInt(transaction?.payload.arguments[1]) / 100000}</p>
			{/if}
		</div>

		<!-- Receiver information -->
		<div class="flex gap-4">
			<h3 class="basis-1/4">Receiver:</h3>
			{#if transaction.payload && transaction.payload.arguments}
				<p>
					{transaction?.payload.arguments[0].substring(0, 8) +
						'......' +
						transaction?.payload.arguments[0].slice(-4)}
				</p>
			{/if}
		</div>
	</div>

	<!-- Loader component to indicate loading state -->
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>
