<script>
	import Header from '$lib/components/Header.svelte';
	import { authenticateUser } from '$lib/modules/secondAuth';
	import { mnemonicPhrase } from '$lib/store/store';
	import { downloadMnemonic } from '$lib/modules/exportMenmonic';

	let password = '';
	let errorMessage = '';
	let secretKey = '';
	let isCorrectPassword = false;

	const handleDownload = () => {
		downloadMnemonic(secretKey);
	};

	const handleSubmit = async () => {
		if (password.length >= 6) {
			isCorrectPassword = authenticateUser(password);
			if (isCorrectPassword) {
				secretKey = await mnemonicPhrase.get();
			} else {
				errorMessage = 'Invalid password';
			}
		} else {
			errorMessage = 'Invalid password';
		}
	};
</script>

<div>
	<Header />
	<br />
	{#if !isCorrectPassword}
		<div>
			<h1 class="text-5xl text-left text-black dark:text-white">Show Seed Phrase</h1>
			<p
				class="text-md mt-5 mb-3 dark:text-white dark:bg-gray-900"
				class:text-red-500={errorMessage.length > 1}
			>
				{errorMessage.length > 1 ? errorMessage : `Enter Password`}
			</p>
			<input
				type="password"
				placeholder="Enter Password"
				class="input input-bordered input-md w-full max-w-xs dark:bg-gray-700 dark:text-white"
				bind:value={password}
			/>
			<button class="btn mt-5" on:click={handleSubmit}> Unlock </button>
		</div>
	{:else}
		<div>
			<h1 class="text-5xl text-left text-black dark:text-white">Show Seed Phrase</h1>
			<div class="p-5 text-lg border rounded-md mt-5 font-semibold">
				{secretKey}
			</div>
			<button on:click={handleDownload} class="btn mt-5">Export mnemonic</button>
		</div>
	{/if}
</div>
