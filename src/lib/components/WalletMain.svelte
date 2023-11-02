<script>
	import { authenticateUser, checkAuth } from '$lib/modules/secondAuth';
	import Wallet from '$lib/components/Wallet.svelte';
	import { onMount } from 'svelte';

	let password = '';
	let errorMessage = '';
	let isWalletPresent = false;
	let isWalletUnlocked = false;

	const handleSubmit = async () => {
		console.log('yellow')
		if (password.length >= 6) {
			const authentication = authenticateUser(password);
			if (authentication) {
				errorMessage = '';
				[isWalletPresent, isWalletUnlocked] = await checkAuth();
				console.log(authentication)
			} else {
				errorMessage = 'Invalid password';
			}
		} else {
			errorMessage = 'Invalid password';
		}
	};

	onMount(async () => {
		[isWalletPresent, isWalletUnlocked] = await checkAuth();
	});
</script>

<div>
	{#if isWalletPresent && !isWalletUnlocked}
		<br />
		<h1 class="text-3xl text-center text-black dark:text-white">Wallet is locked!</h1>
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
	{:else if isWalletPresent && isWalletUnlocked}
		<Wallet />
	{/if}
</div>
