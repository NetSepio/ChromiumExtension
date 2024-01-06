<script>
	import { authenticateUser, checkAuth } from '$lib/modules/secondAuth';
	import Wallet from '$lib/components/Wallet.svelte';
	import { onMount } from 'svelte';
	import Logout from '$lib/components/Logout.svelte';

	let password = '';
	let errorMessage = '';
	let isWalletPresent = false;
	let isWalletUnlocked = false;
	let resetPassword = false;

	const handleSubmit = async () => {
		if (password.length >= 6) {
			try {
				const authentication = authenticateUser(password);

				if (authentication) {
					errorMessage = '';
					[isWalletPresent, isWalletUnlocked] = await checkAuth();
				}
			} catch (error) {
				errorMessage = 'Invalid password';
				console.log(error);
			}
		}
	};

	onMount(async () => {
		[isWalletPresent, isWalletUnlocked] = await checkAuth();
	});
</script>

<div>
	<!-- {#if isWalletPresent && !isWalletUnlocked}
		<br />
		<h1 class="text-3xl text-center text-black dark:text-white">Wallet is locked!</h1>
		<p
			class="text-lg mt-5 mb-3 dark:text-white dark:bg-gray-900"
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
		<button class="block text-1xl" on:click={() => (resetPassword = true)}>Forgot password?</button>
		<div class="flex justify-between items-baseline">
			<button class="btn mt-5" on:click={handleSubmit}> Unlock </button>

			{#if resetPassword}
				<Logout />
			{/if}
		</div>
	{:else if isWalletPresent && isWalletUnlocked} -->
	<Wallet />
	<!-- {/if} -->
</div>
