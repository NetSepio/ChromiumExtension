<script>
	import Header from '$lib/components/Header.svelte';
	import { authenticateUser } from '$lib/modules/secondAuth';
	import { mnemonicPhase } from '$lib/store/store';

	let password = '';
	let errorMessage = '';
	let secretKey = '';
	let isCorrectPassword = false;

	const handleSubmit = async () => {
		if (password.length >= 6) {
			isCorrectPassword = authenticateUser(password);
			if (isCorrectPassword) {
				secretKey = await mnemonicPhase.get();
			}
		} else {
			errorMessage = 'Invalid password';
		}
	};
</script>

<div>
	{#if !isCorrectPassword}
		<div class="artboard phone-3 p-5 mb-5 pb-5">
			<Header />
			<br />
			<h1 class="text-5xl text-left text-black dark:text-white">Show Secret Key</h1>
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
		<div class="artboard phone-3 p-5 mb-5 pb-5">
			<Header />
			<br />
			<h1 class="text-5xl text-left text-black dark:text-white">Show Secret Key</h1>
			<div class="p-5 text-lg border rounded-md mt-5 font-semibold">
				{secretKey}
			</div>
		</div>
	{/if}
</div>
